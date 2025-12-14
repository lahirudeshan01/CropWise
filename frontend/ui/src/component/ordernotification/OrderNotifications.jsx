import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import io from 'socket.io-client';
import axios from 'axios';
import api from '../../api/apiUtils';

const OrderNotifications = ({ onNewOrder }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Fetch existing notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications...');
        const response = await axios.get('/api/notifications');
        console.log('Raw notifications response:', response.data);
        const fetchedNotifications = response.data
          .filter(notification => notification.orderId) // Only keep notifications with a valid order
          .map(notification => {
            console.log('Processing notification:', notification);
            return {
              id: notification._id,
              orderId: notification.orderId ? notification.orderId._id : null,
              order: notification.orderId || null,
              message: notification.message,
              time: new Date(notification.createdAt),
              read: notification.seen
            };
          });
        console.log('Processed notifications:', fetchedNotifications);
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Socket.IO connection
  useEffect(() => {
    // Create socket with reconnection options
    const socket = io('http://localhost:3000', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Listen for connection events
    socket.on('connect', () => {
      console.log('Connected to notification system:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notification system');
    });

    // Listen for new-order events
    socket.on('new-order', (data) => {
      console.log('New order notification received:', data);
      
      if (data && (data._id || data.id)) {
        const newNotification = {
          id: data._id || data.id,
          orderId: data._id || data.id,
          message: data.message,
          time: new Date(),
          read: false
        };
        console.log('Created new notification:', newNotification);

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Play notification sound if available
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(err => console.log('Audio play failed:', err));
        } catch (err) {
          console.log('Error playing notification sound:', err);
        }
        
        // Refresh orders list if callback provided
        if (onNewOrder) {
          onNewOrder();
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [onNewOrder]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    
    // Mark all as read when closing the menu
    if (unreadCount > 0) {
      try {
        await axios.patch('/api/notifications/mark-all-seen');
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log('Notification clicked:', notification);
    try {
      // Mark notification as read
      await axios.patch(`/api/notifications/${notification.id}/seen`);
      
      // Update local notification state
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));

      if (notification.order) {
        console.log('Using cached order data:', notification.order);
        setSelectedOrder(notification.order);
        setOrderDetailsOpen(true);
        setAnchorEl(null);
      } else {
        console.log('Fetching order details for orderId:', notification.orderId);
        const response = await axios.get(`/api/orders/${notification.orderId}`);
        console.log('Order details response:', response.data);
        setSelectedOrder(response.data);
        setOrderDetailsOpen(true);
        setAnchorEl(null);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      alert('Error fetching order details. Please try again.');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClearAll = async () => {
    try {
      // Delete all notifications using the bulk delete endpoint
      await axios.delete('/api/notifications/clear-all');
      
      // Clear notifications from frontend state
      setNotifications([]);
      setUnreadCount(0);
      // Close the menu
      setAnchorEl(null);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      alert('Error clearing notifications. Please try again.');
    }
  };

  return (
    <>
      <IconButton
        aria-label="notifications"
        color="primary"
        onClick={handleClick}
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notifications-button',
        }}
        PaperProps={{
          style: {
            maxHeight: 350,
            width: '300px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              sx={{ 
                backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" noWrap>
                  {notification.message}
                </Typography>
                {notification.orderId && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Order ID: {notification.orderId}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {formatTime(notification.time)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}

        {notifications.length > 0 && (
          <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid #eee' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                cursor: 'pointer', 
                fontSize: '0.8rem',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={handleClearAll}
            >
              Clear all
            </Typography>
          </Box>
        )}
      </Menu>

      <Dialog 
        open={orderDetailsOpen} 
        onClose={() => setOrderDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Order Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  Product Information
                </Typography>
                <Box sx={{ pl: 2, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedOrder.product.Character}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {selectedOrder.quantity}kg
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price per unit:</strong> Rs. {selectedOrder.product.price}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  Delivery Information
                </Typography>
                <Box sx={{ pl: 2, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedOrder.deliveryInfo.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {selectedOrder.deliveryInfo.address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedOrder.deliveryInfo.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedOrder.deliveryInfo.email}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  Payment Information
                </Typography>
                <Box sx={{ pl: 2, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Method:</strong> {selectedOrder.paymentMethod}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Amount:</strong> Rs. {selectedOrder.totalPrice}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedOrder.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Order Date:</strong> {formatDate(selectedOrder.dateCreated)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderNotifications;