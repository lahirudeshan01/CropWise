const express = require('express');
const router = express.Router();
const Order = require('../models/ordersnew');
const Transaction = require('../models/finance');
const Notification = require('../models/notificationModel');
const Farmers = require('../models/farmers');
const socketIO = require('../config/socketio');
const auth = require('../middleware/auth'); // Import auth middleware

// Apply auth middleware to all routes
router.use(auth);

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('Order POST received:', req.body);
    const {
      product,
      quantity,
      totalPrice,
      deliveryInfo,
      paymentMethod,
      paymentDetails,
      status,
      farmerId // Add farmerId to identify which listing to update
    } = req.body;

    // Validate required fields
    if (!product || !quantity || !totalPrice || !deliveryInfo || !paymentMethod || !farmerId) {
      console.log('Missing required fields:', { product, quantity, totalPrice, deliveryInfo, paymentMethod, farmerId });
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    // Find the farmer listing and update quantity
    const farmerListing = await Farmers.findById(farmerId);
    if (!farmerListing) {
      console.log('Farmer listing not found for ID:', farmerId);
      return res.status(404).json({ 
        success: false,
        message: "Farmer listing not found" 
      });
    }

    console.log('Found farmer listing:', farmerListing);

    // Check if sufficient quantity is available
    if (farmerListing.quantity < quantity) {
      console.log('Insufficient quantity:', { available: farmerListing.quantity, requested: quantity });
      return res.status(400).json({ 
        success: false,
        message: `Insufficient quantity. Only ${farmerListing.quantity} kg available.` 
      });
    }

    // Update the farmer's quantity
    await farmerListing.updateQuantity(quantity);
    console.log('Updated farmer quantity:', farmerListing.quantity);

    const newOrder = new Order({
      userId: req.user._id, // Customer who placed the order
      farmerId: farmerListing._id, // Store the farmer ID for reference
      product,
      quantity,
      totalPrice,
      deliveryInfo,
      paymentMethod,
      paymentDetails,
      status
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder._id);

    // Create transaction for the order (for the customer)
    const newTransaction = new Transaction({
      userId: req.user._id, // Customer's transaction
      name: `Purchase - Order #${savedOrder._id}`,
      amount: totalPrice,
      status: 'Outcome', // Customer is spending money
      reference: 'Purchase Expense',
      date: new Date()
    });

    await newTransaction.save();
    console.log('Customer transaction created:', newTransaction._id);

    // Create a transaction for the farmer (income)
    const farmerTransaction = new Transaction({
      userId: farmerListing.userId, // Farmer's transaction
      name: `Sale - Order #${savedOrder._id}`,
      amount: totalPrice,
      status: 'Income', // Farmer is earning money
      reference: 'Sales Income',
      date: new Date()
    });

    await farmerTransaction.save();
    console.log('Farmer transaction created:', farmerTransaction._id);

    // Create notification for the FARMER (not the customer)
    const notification = new Notification({
      userId: farmerListing.userId, // Send notification to the farmer who owns the listing
      type: 'new-order',
      orderId: savedOrder._id,
      message: `New order received for ${product.Character} - ${quantity}kg from ${deliveryInfo.name}`
    });

    await notification.save();
    console.log('Notification created for farmer:', notification._id);

    // Emit socket event for the new order
    try {
      socketIO.emitNewOrder({
        _id: savedOrder._id,
        message: `New order received for ${product.Character} - ${quantity}kg`
      });
    } catch (socketError) {
      console.error('Error emitting socket event:', socketError);
    }

    res.status(201).json({ 
      success: true,
      message: "Order added successfully!",
      order: savedOrder,
      updatedQuantity: farmerListing.quantity
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

// Get all orders (for current user - customers see their own orders)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for farmer (orders placed on their listings)
router.get('/farmer-orders', async (req, res) => {
  try {
    // Find all farmer listings owned by the current user
    const farmerListings = await Farmers.find({ userId: req.user._id });
    const listingIds = farmerListings.map(listing => listing._id);
    
    // Find all orders that reference these listings
    const orders = await Order.find({ farmerId: { $in: listingIds } })
      .populate('userId', 'firstName lastName email') // Populate customer info
      .populate('farmerId', 'Character verity price'); // Populate product info
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID (for current user)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test endpoint to verify order system
router.get('/test/system', async (req, res) => {
  try {
    // Get some sample data
    const farmers = await Farmers.find({}).limit(1);
    const orders = await Order.find({}).limit(1);
    const notifications = await Notification.find({}).limit(1);
    
    res.json({
      message: 'Order system is working',
      farmersCount: await Farmers.countDocuments(),
      ordersCount: await Order.countDocuments(),
      notificationsCount: await Notification.countDocuments(),
      sampleFarmer: farmers[0] || null,
      sampleOrder: orders[0] || null,
      sampleNotification: notifications[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: 'System test failed', error: error.message });
  }
});

module.exports = router;