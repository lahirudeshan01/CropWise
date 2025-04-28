// config/socketio.js
const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: "http://localhost:5173", // Update this to your frontend URL
        methods: ["GET", "POST"]
      }
    });
    
    // Create namespace for orders
    const orderNamespace = io.of('/orders');
    
    // Authentication middleware if needed
    orderNamespace.use((socket, next) => {
      // You can add authentication here
      next();
    });
    
    orderNamespace.on('connection', (socket) => {
      console.log('Client connected to orders namespace');
      
      socket.on('disconnect', () => {
        console.log('Client disconnected from orders namespace');
      });
    });
    
    console.log('Socket.IO initialized');
    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized');
    }
    return io;
  },
  
  // Helper function to emit new order notifications
  emitNewOrder: (orderData) => {
    if (!io) {
      throw new Error('Socket.IO not initialized');
    }
    
    // Emit to the orders namespace
    io.of('/orders').emit('new-order', orderData);
    console.log('New order notification emitted:', orderData);
  }
};
