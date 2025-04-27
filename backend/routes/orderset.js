const express = require('express');
const router = express.Router();
const Order = require('../models/ordersnew');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      product,
      quantity,
      totalPrice,
      deliveryInfo,
      paymentMethod,
      paymentDetails,
      status
    } = req.body;

    const newOrder = new Order({
      product,
      quantity,
      totalPrice,
      deliveryInfo,
      paymentMethod,
      paymentDetails,
      status
    });

    const savedOrder = await newOrder.save();
    
    // Get Socket.IO instance from app
    const io = req.app.get('socketio');
    
    // Emit event to notify about new order
    if (io) {
      io.of('/orders').emit('new-order', {
        id: savedOrder._id,
        product: savedOrder.product,
        totalPrice: savedOrder.totalPrice,
        deliveryInfo: savedOrder.deliveryInfo,
        status: savedOrder.status,
        timestamp: new Date()
      });
      console.log('Order notification emitted for order:', savedOrder._id);
    }

    res.status(201).json({ 
      success: true,
      message: "Order added successfully!",
      order: savedOrder 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create order", 
      error: error.message 
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get Socket.IO instance from app
    const io = req.app.get('socketio');
    
    // Emit status update notification
    if (io) {
      io.of('/orders').emit('order-status-update', {
        id: order._id,
        status: order.status,
        timestamp: new Date()
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating order status', 
      error: error.message 
    });
  }
});

module.exports = router;