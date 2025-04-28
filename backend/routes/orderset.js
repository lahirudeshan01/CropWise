const express = require('express');
const router = express.Router();
const Order = require('../models/ordersnew');
const Transaction = require('../models/finance');
const Notification = require('../models/notificationModel');
const socketIO = require('../config/socketio');

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

    // Create transaction for the order
    const newTransaction = new Transaction({
      name: `Sale - Order #${savedOrder._id}`,
      amount: totalPrice,
      status: 'Income',
      reference: 'Sales Income',
      date: new Date()
    });

    await newTransaction.save();
    console.log('Sales transaction created successfully:', newTransaction);

    // Create notification for the new order
    const notification = new Notification({
      type: 'new-order',
      orderId: savedOrder._id,
      message: `New order received for ${product.Character} - ${quantity}kg (Order ID: ${savedOrder._id})`
    });

    await notification.save();

    // Emit socket event for the new order
    try {
      socketIO.emitNewOrder({
        _id: savedOrder._id,
        message: `New order received for ${product.Character} - ${quantity}kg (Order ID: ${savedOrder._id})`
      });
    } catch (socketError) {
      console.error('Error emitting socket event:', socketError);
    }

    res.status(201).json({ 
      success: true,
      message: "Order added successfully!",
      order: savedOrder 
    });
  } catch (error) {
    console.error('Error creating order or transaction:', error);
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

module.exports = router;