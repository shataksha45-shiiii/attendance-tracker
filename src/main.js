import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js';

// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyD8FtBU64GCStnVDGrhGajzHyG6aVVFgPg",
  authDomain: "attendancetracker-b80c3.firebaseapp.com",
  projectId: "attendancetracker-b80c3",
  storageBucket: "attendancetracker-b80c3.appspot.com",
  messagingSenderId: "945153627888",
  appId: "1:945153627888:web:d8a9910c09f7296d599435",
  measurementId: "G-Z6KR8L6XN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==================== STATE MANAGEMENT ====================
let currentUser = null;
let subjects = [];
let selectedSubject = null;
let selectedDateForBackdate = null;

// ==================== DOM ELEMENTS ====================
const loginView = document.getElementById('login-view');
const mainContent = document.getElementById('main-content');
const sidebar = document.getElementById('sidebar');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');

const dashboardView = document.getElementById('dashboard-view');
const analyticsView = document.getElementById('analytics-view');
const navDashboard = document.getElementById('nav-dashboard');
const navAnalytics = document.getElementById('nav-analytics');

const modal = document.getElementById('modal');
const newSubjectNameInput = document.getElementById('new-subject-name');
const addSubjectBtn = document.getElementById('add-subject-btn');
const confirmAddSubject = document.getElementById('confirm-add-subject');
const cancelModal = document.getElementById('cancel-modal');

const subjectsGrid = document.getElementById('subjects-grid');
const analyticsGrid = document.getElementById('analytics-grid');
const userName = document.getElementById('user-name');
const currentDateDisplay = document.getElementById('current-date');

const historyModal = document.getElementById('history-modal');
const closeHistoryModal = document.getElementById('close-history-modal');
const historySubjectTitle = document.getElementById('history-subject-title');
const subjectHistoryList = document.getElementById('subject-history-list');
const filterAll = document.getElementById('filter-all');
const filterPresent = document.getElementById('filter-present');
const filterAbsent = document.getElementById('filter-absent');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const backdateModal = document.getElementById('backdate-modal');
const closeBackdateModal = document.getElementById('close-backdate-modal');
const confirmBackdatePresent = document.getElementById('confirm-backdate-present');
const confirmBackdateAbsent = document.getElementById('confirm-backdate-absent');
const inlineCalendarContainer = document.getElementById('inline-calendar-container');

// ==================== INITIALIZATION ====================
window.addEventListener('load', () => {
  registerServiceWorker();
  initializeAuthListener();
  updateCurrentDate();
  setInterval(updateCurrentDate, 60000); // Update every minute instead of every second
});

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  }
}

// ==================== AUTHENTICATION ====================
function initializeAuthListener() {
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      const displayName = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
      userName.textContent = displayName;
      const userNameAnalytics = document.getElementById('user-name-analytics');
      if (userNameAnalytics) userNameAnalytics.textContent = displayName;
      showMainUI();
      loadSubjects();
    } else {
      currentUser = null;
      showLoginUI();
    }
  });
}

function showLoginUI() {
  loginView.classList.remove('hidden');
  mainContent.classList.add('hidden');
  sidebar.classList.add('hidden');
}

function showMainUI() {
  loginView.classList.add('hidden');
  mainContent.classList.remove('hidden');
  sidebar.classList.remove('hidden');
}

// Google Login
googleLoginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .catch(error => alert(`Login failed: ${error.message}`));
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => showLoginUI())
    .catch(error => alert(`Logout failed: ${error.message}`));
});

// ==================== NAVIGATION ====================
navDashboard.addEventListener('click', () => {
  dashboardView.classList.remove('hidden');
  analyticsView.classList.add('hidden');
  navDashboard.classList.add('active');
  navAnalytics.classList.remove('active');
});

navAnalytics.addEventListener('click', () => {
  dashboardView.classList.add('hidden');
  analyticsView.classList.remove('hidden');
  navDashboard.classList.remove('active');
  navAnalytics.classList.add('active');
  renderAnalytics();
});

// ==================== DATE MANAGEMENT ====================
function updateCurrentDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', options);
  currentDateDisplay.textContent = today;
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDateKey(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toISOString().split('T')[0];
}

// ==================== MODAL MANAGEMENT ====================
function openModal() {
  modal.classList.remove('hidden');
  newSubjectNameInput.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  newSubjectNameInput.value = '';
}

function openHistoryModal(subject) {
  selectedSubject = subject;
  historySubjectTitle.textContent = `${subject.name} - History`;
  historyModal.classList.remove('hidden');
  renderHistoryList('all');
  filterAll.classList.add('active');
  filterPresent.classList.remove('active');
  filterAbsent.classList.remove('active');
}

function closeHistoryModalFn() {
  historyModal.classList.add('hidden');
  selectedSubject = null;
}

function openBackdateModal(subject) {
  selectedSubject = subject;
  backdateModal.classList.remove('hidden');
  initializeCalendar();
}

function closeBackdateModalFn() {
  backdateModal.classList.add('hidden');
  selectedDateForBackdate = null;
}

// Modal Event Listeners
addSubjectBtn.addEventListener('click', openModal);
cancelModal.addEventListener('click', closeModal);
closeHistoryModal.addEventListener('click', closeHistoryModalFn);
closeBackdateModal.addEventListener('click', closeBackdateModalFn);

// Close modals on outside click
[modal, historyModal, backdateModal].forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) {
      if (m === modal) closeModal();
      else if (m === historyModal) closeHistoryModalFn();
      else if (m === backdateModal) closeBackdateModalFn();
    }
  });
});

// ==================== SUBJECT MANAGEMENT ====================
async function loadSubjects() {
  if (!currentUser) return;

  try {
    const q = query(collection(db, 'subjects'), where('userId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    subjects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderDashboard();
  } catch (error) {
    console.error('Error loading subjects:', error);
  }
}

confirmAddSubject.addEventListener('click', async () => {
  const subjectName = newSubjectNameInput.value.trim();
  if (!subjectName) {
    showNotification('Please enter a class name', 'error');
    newSubjectNameInput.focus();
    return;
  }

  if (subjectName.length > 50) {
    showNotification('Class name is too long (max 50 characters)', 'error');
    return;
  }

  try {
    confirmAddSubject.disabled = true;
    confirmAddSubject.textContent = 'Adding...';
    
    await addDoc(collection(db, 'subjects'), {
      userId: currentUser.uid,
      name: subjectName,
      createdAt: serverTimestamp(),
      color: getRandomColor()
    });
    
    showNotification('Class added successfully!', 'success');
    loadSubjects();
    closeModal();
  } catch (error) {
    console.error('Error adding subject:', error);
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    confirmAddSubject.disabled = false;
    confirmAddSubject.textContent = 'Add Class';
  }
});

function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== ATTENDANCE TRACKING ====================
async function markAttendance(subject, status) {
  if (!currentUser) return;

  try {
    const today = getDateKey(new Date());
    const attendanceRef = collection(db, 'attendance');
    
    // Check if record exists
    const q = query(
      attendanceRef,
      where('userId', '==', currentUser.uid),
      where('subjectId', '==', subject.id),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      // Update existing record
      await updateDoc(doc(db, 'attendance', snapshot.docs[0].id), {
        status: status,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new record
      await addDoc(attendanceRef, {
        userId: currentUser.uid,
        subjectId: subject.id,
        date: today,
        status: status,
        createdAt: serverTimestamp()
      });
    }

    loadSubjects();
    showNotification(`Marked as ${status}`, 'success');
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}

async function markBackdateAttendance(subject, status) {
  if (!selectedDateForBackdate || !currentUser) return;

  try {
    const selectedDate = getDateKey(new Date(selectedDateForBackdate));
    const attendanceRef = collection(db, 'attendance');
    
    const q = query(
      attendanceRef,
      where('userId', '==', currentUser.uid),
      where('subjectId', '==', subject.id),
      where('date', '==', selectedDate)
    );
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      await updateDoc(doc(db, 'attendance', snapshot.docs[0].id), {
        status: status,
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(attendanceRef, {
        userId: currentUser.uid,
        subjectId: subject.id,
        date: selectedDate,
        status: status,
        createdAt: serverTimestamp()
      });
    }

    loadSubjects();
    closeBackdateModalFn();
    showNotification(`Marked as ${status} for ${formatDate(selectedDate)}`, 'success');
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}

async function deleteSubject(subject) {
  if (!confirm(`Delete "${subject.name}"? This cannot be undone.`)) return;

  try {
    await deleteDoc(doc(db, 'subjects', subject.id));
    loadSubjects();
    showNotification('Subject deleted', 'success');
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}

// ==================== HISTORY MANAGEMENT ====================
async function getSubjectAttendance(subject) {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', currentUser.uid),
      where('subjectId', '==', subject.id)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error loading attendance:', error);
    return [];
  }
}

function renderHistoryList(filter) {
  if (!selectedSubject) return;

  getSubjectAttendance(selectedSubject).then(records => {
    subjectHistoryList.innerHTML = '';

    const filtered = filter === 'all' 
      ? records 
      : records.filter(r => r.status === filter);

    if (filtered.length === 0) {
      subjectHistoryList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No records</div>
          <p class="empty-state-text">No ${filter === 'all' ? 'attendance' : filter} records found.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(record => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const statusClass = record.status === 'present' ? 'present' : 'absent';
      item.innerHTML = `
        <span class="history-date">${formatDate(record.date)}</span>
        <span class="history-status ${statusClass}">${record.status}</span>
      `;
      subjectHistoryList.appendChild(item);
    });
  });
}

filterAll.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  filterAll.classList.add('active');
  renderHistoryList('all');
});

filterPresent.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  filterPresent.classList.add('active');
  renderHistoryList('present');
});

filterAbsent.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  filterAbsent.classList.add('active');
  renderHistoryList('absent');
});

clearHistoryBtn.addEventListener('click', async () => {
  if (!selectedSubject || !confirm('Clear all attendance history for this subject?')) return;

  try {
    const records = await getSubjectAttendance(selectedSubject);
    for (const record of records) {
      await deleteDoc(doc(db, 'attendance', record.id));
    }
    renderHistoryList('all');
    showNotification('History cleared', 'success');
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
});

// ==================== CALENDAR for BACKDATE ====================
function initializeCalendar() {
  inlineCalendarContainer.innerHTML = '';
  
  flatpickr(inlineCalendarContainer, {
    inline: true,
    mode: 'single',
    maxDate: new Date(),
    onChange: (selectedDates) => {
      selectedDateForBackdate = selectedDates[0];
    }
  });
}

confirmBackdatePresent.addEventListener('click', () => {
  markBackdateAttendance(selectedSubject, 'present');
});

confirmBackdateAbsent.addEventListener('click', () => {
  markBackdateAttendance(selectedSubject, 'absent');
});

// ==================== RENDERING ====================
async function renderDashboard() {
  subjectsGrid.innerHTML = '';

  if (subjects.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem;">
        <div class="empty-state-icon">📚</div>
        <div class="empty-state-title">No subjects yet</div>
        <p class="empty-state-text">Add your first subject to get started tracking attendance.</p>
      </div>
    `;
    return;
  }

  for (const subject of subjects) {
    const attendanceRecords = await getSubjectAttendance(subject);
    const stats = calculateStats(attendanceRecords);

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <h3 class="card-title">${subject.name}</h3>
      
      <div class="card-stats">
        <div class="stat">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Classes</div>
        </div>
        <div class="stat">
          <div class="stat-value">${stats.present}</div>
          <div class="stat-label">Present</div>
        </div>
        <div class="stat">
          <div class="stat-value">${stats.percentage}%</div>
          <div class="stat-label">Attendance</div>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${stats.percentage}%"></div>
      </div>

      <div class="card-actions">
        <button class="btn-action present" data-subject-id="${subject.id}" data-action="mark-present">
          <i class="ri-check-line"></i> Present
        </button>
        <button class="btn-action absent" data-subject-id="${subject.id}" data-action="mark-absent">
          <i class="ri-close-line"></i> Absent
        </button>
      </div>

      <div class="card-actions" style="margin-top: 0.75rem; gap: 0.5rem;">
        <button class="btn-action history" data-subject-id="${subject.id}" data-action="history" style="flex: 1;">
          <i class="ri-history-line"></i> History
        </button>
        <button class="btn-action history" data-subject-id="${subject.id}" data-action="backdate" style="flex: 1;">
          <i class="ri-calendar-line"></i> Backdate
        </button>
        <button class="btn-action delete" data-subject-id="${subject.id}" data-action="delete">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    `;

    card.addEventListener('click', e => {
      const button = e.target.closest('[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const subjectId = button.dataset.subjectId;
      const subject = subjects.find(s => s.id === subjectId);

      switch (action) {
        case 'mark-present':
          markAttendance(subject, 'present');
          break;
        case 'mark-absent':
          markAttendance(subject, 'absent');
          break;
        case 'history':
          openHistoryModal(subject);
          break;
        case 'backdate':
          openBackdateModal(subject);
          break;
        case 'delete':
          deleteSubject(subject);
          break;
      }
    });

    subjectsGrid.appendChild(card);
  }
}

function calculateStats(records) {
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

  return { total, present, percentage };
}

async function renderAnalytics() {
  analyticsGrid.innerHTML = '';

  if (subjects.length === 0) {
    analyticsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem;">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-title">No data yet</div>
        <p class="empty-state-text">Add subjects and mark attendance to see analytics.</p>
      </div>
    `;
    return;
  }

  for (const subject of subjects) {
    const records = await getSubjectAttendance(subject);
    const stats = calculateStats(records);

    const card = document.createElement('div');
    card.className = 'analytics-card';
    card.innerHTML = `
      <div class="analytics-header">
        <h3>${subject.name}</h3>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Overall Attendance</strong></p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${stats.percentage}%"></div>
        </div>
        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-light);">${stats.present} of ${stats.total} classes (${stats.percentage}%)</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div style="text-align: center; padding: 1rem; background: rgba(46, 204, 113, 0.1); border-radius: var(--radius-md);">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${stats.present}</div>
          <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">Present</div>
        </div>
        <div style="text-align: center; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-radius: var(--radius-md);">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--danger);">${stats.total - stats.present}</div>
          <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">Absent</div>
        </div>
      </div>
    `;

    analyticsGrid.appendChild(card);
  }
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'info') {
  const icons = {
    success: 'ri-check-circle-line',
    error: 'ri-alert-circle-line',
    info: 'ri-information-line'
  };

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="${icons[type]}" style="font-size: 1.25rem; flex-shrink: 0;"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3500);
}

// ==================== KEYBOARD SHORTCUTS ==================== 
document.addEventListener('keydown', e => {
  // Escape to close modals
  if (e.key === 'Escape') {
    if (!modal.classList.contains('hidden')) closeModal();
    if (!historyModal.classList.contains('hidden')) closeHistoryModalFn();
    if (!backdateModal.classList.contains('hidden')) closeBackdateModalFn();
  }
  
  // Ctrl/Cmd + N to add new subject
  if ((e.ctrlKey || e.metaKey) && e.key === 'n' && currentUser && mainContent.classList.contains('hidden') === false) {
    e.preventDefault();
    openModal();
  }
});

// Allow Enter to add subject
newSubjectNameInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmAddSubject.click();
  }
});
