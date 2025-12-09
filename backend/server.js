const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// In-memory storage for active rooms
const rooms = new Map();

// REST API Endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, {
    id: roomId,
    createdAt: new Date().toISOString(),
    participants: [],
    currentCode: '// Welcome to the coding interview!\n// Start typing your code here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();'
  });
  res.status(201).json({ roomId, url: `/room/${roomId}` });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    roomId: room.id,
    participantCount: room.participants.length,
    createdAt: room.createdAt
  });
});

// Socket.io Real-time Communication
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific room
  socket.on('join-room', (roomId) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('room-error', { message: 'Room does not exist' });
      return;
    }

    socket.join(roomId);
    socket.roomId = roomId;
    
    // Add participant to room
    room.participants.push({
      socketId: socket.id,
      joinedAt: new Date().toISOString()
    });

    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Send current code state to the new joiner
    socket.emit('load-code', { code: room.currentCode });
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      participantCount: room.participants.length
    });
    
    // Send participant count to the joiner
    socket.emit('room-info', {
      participantCount: room.participants.length
    });
  });

  // Handle code changes
  socket.on('code-change', ({ roomId, code }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      return;
    }

    // Update room's current code
    room.currentCode = code;
    
    // Broadcast to all clients in the room EXCEPT the sender
    socket.to(roomId).emit('code-update', { code });
  });

  // Handle cursor position changes (optional enhancement)
  socket.on('cursor-change', ({ roomId, position }) => {
    socket.to(roomId).emit('cursor-update', {
      userId: socket.id,
      position
    });
  });

  // Handle code execution events (for logging/analytics)
  socket.on('code-executed', ({ roomId, timestamp }) => {
    socket.to(roomId).emit('execution-notification', {
      userId: socket.id,
      timestamp
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomId) {
      const room = rooms.get(socket.roomId);
      
      if (room) {
        // Remove participant from room
        room.participants = room.participants.filter(
          p => p.socketId !== socket.id
        );
        
        // Notify others
        socket.to(socket.roomId).emit('user-left', {
          participantCount: room.participants.length
        });

        // Clean up empty rooms after 5 minutes
        if (room.participants.length === 0) {
          setTimeout(() => {
            const currentRoom = rooms.get(socket.roomId);
            if (currentRoom && currentRoom.participants.length === 0) {
              rooms.delete(socket.roomId);
              console.log(`Room ${socket.roomId} cleaned up`);
            }
          }, 5 * 60 * 1000);
        }
      }
    }
  });
});


const PORT = process.env.PORT || 3001;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = { app, server, io };
