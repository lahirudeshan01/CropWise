// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');
const auth = require('../middleware/auth'); // Import auth middleware

// Apply auth middleware to all routes
router.use(auth);

// Get all notifications (for current user)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderId',
        select: '-__v',
        populate: {
          path: 'product',
          select: 'Character price'
        }
      });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as seen (for current user)
router.patch('/:id/seen', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Add user filter
      { seen: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark all notifications as seen (for current user)
router.patch('/mark-all-seen', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { seen: true }); // Add user filter
    res.status(200).json({ message: 'All notifications marked as seen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all notifications (for current user)
router.delete('/clear-all', async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id }); // Add user filter
    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification (for current user)
router.delete('/:id', async (req, res) => {
  try {
    const deletedNotification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); // Add user filter
    
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
