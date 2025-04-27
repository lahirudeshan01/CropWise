import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import io from 'socket.io-client';

const OrderNotifications = ({ onNewOrder }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Create socket with reconnection options
    const socket = io('http://localhost:3000/orders', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Listen for connection events
    socket.on('connect', () => {
      console.log('Connected to orders namespace:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from orders namespace');
    });

    // Listen for new-order events
    socket.on('new-order', (data) => {
      console.log('New order notification received:', data);
      
      // If data contains an order ID, process it as a notification
      if (data && (data._id || data.id)) {
        const orderId = data._id || data.id;
        const newNotification = {
          id: Date.now(),
          message: `New order received: ${orderId.substring(0, 8)}...`,
          time: new Date(),
          read: false
        };

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

  // Rest of your component remains the same
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Mark all as read when closing the menu
    if (unreadCount > 0) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <MenuItem key={notification.id} sx={{ 
              backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" noWrap>
                  {notification.message}
                </Typography>
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
              sx={{ cursor: 'pointer', fontSize: '0.8rem' }}
              onClick={() => setNotifications([])}
            >
              Clear all
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default OrderNotifications;