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

module.exports = router;