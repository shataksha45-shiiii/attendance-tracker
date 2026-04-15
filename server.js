const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Path to store data
const dataFile = path.join(__dirname, 'hotel-data.json');

// Initialize data file
function initDataFile() {
  if (!fs.existsSync(dataFile)) {
    const defaultData = {};
    [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30].forEach(num => {
      defaultData[num] = {
        status: 'available',
        guestName: '',
        guestPhone: '',
        checkInDateTime: '',
        aadhaarImage: null
      };
    });
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

// Get all rooms data
function getRooms() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return {};
  }
}

// Save rooms data
function saveRooms(rooms) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(rooms, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// REST API endpoints
app.get('/api/rooms', (req, res) => {
  res.json(getRooms());
});

app.post('/api/rooms', (req, res) => {
  const rooms = req.body;
  saveRooms(rooms);
  io.emit('rooms-updated', rooms); // Broadcast to all clients
  res.json({ success: true });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current data to new client
  socket.emit('rooms-data', getRooms());
  
  // Listen for updates
  socket.on('update-rooms', (rooms) => {
    saveRooms(rooms);
    io.emit('rooms-updated', rooms); // Broadcast to all clients
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize
initDataFile();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Hotel Manager Server running on port ${PORT}`);
});
