import React, { useState, useEffect } from 'react';
 import OrderNotifications from '../ordernotification/OrderNotifications';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip
} from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';

const LOGO_URL = "https://p7.hiclipart.com/preview/976/522/355/natural-environment-earth-ecology-clean-environment.jpg";

const Showorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };

  // Set up socket connection and fetch orders
  useEffect(() => {
    fetchOrders();

    // Create socket connection
    const socket = io('http://localhost:3000/orders', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Listen for new orders
    socket.on('new-order', (newOrder) => {
      console.log('New order received:', newOrder);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Generate PDF report for the entire order summary table
  const generatePDF = () => {
    if (!orders || orders.length === 0) {
      alert('No orders available to generate a report.');
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Cropwise Order Summary Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .print-header {
              text-align: center;
              margin-top: 30px;
              margin-bottom: 24px;
            }
            .print-logo {
              width: 90px;
              height: 90px;
              object-fit: contain;
              display: block;
              margin: 0 auto 12px auto;
            }
            .company-name {
              font-size: 2.5em;
              font-weight: bold;
              color: rgb(20, 188, 11);
              margin-bottom: 4px;
              letter-spacing: 2px;
            }
            .company-desc {
              font-size: 1.3em;
              color: #4b4b4b;
              margin-bottom: 18px;
            }
            .spacer {
              height: 30px;
            }
            .print-date {
              text-align: right;
              margin-bottom: 10px;
              font-size: 1em;
              color: #555;
            }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0286fa; color: #fff; }
            .status-badge { 
              padding: 6px 18px; 
              border-radius: 8px; 
              font-size: 1em;
              min-width: 90px;
              display: inline-block;
              text-align: center;
              font-weight: 600;
            }
            .status-badge.pending { background: #ffd600; color: #222; }
            .status-badge.processing { background: #0286fa; color: #fff; }
            .status-badge.shipped { background: #0286fa; color: #fff; }
            .status-badge.delivered { background: #43a047; color: #fff; }
            .status-badge.cancelled { background: #d32f2f; color: #fff; }
            .status-badge.default { background: #757575; color: #fff; }
            .total-section {
              margin-top: 18px;
              display: flex;
              justify-content: flex-end;
              font-size: 1.15em;
              font-weight: bold;
              color: #222;
              background: #f5f5f5;
              padding: 12px 24px;
              border-radius: 6px;
              max-width: 320px;
              margin-left: auto;
            }
            .total-label {
              margin-right: 16px;
            }
            .print-footer {
              margin-top: 60px;
              font-style: italic;
              color: #555;
              text-align: right;
              font-size: 1em;
            }
            .signature-section {
              margin-top: 60px;
              text-align: left;
              font-size: 1.1em;
              color: #222;
            }
            .signature-line {
              margin-bottom: 4px;
              margin-left: 0;
              font-size: 1.5em;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="${LOGO_URL}" alt="CropWise Logo" class="print-logo" />
            <div class="company-name">CropWise</div>
            <div class="company-desc">Smart Agriculture</div>
          </div>
          <div class="spacer"></div>
          <h2 style="text-align:center;margin-bottom:10px;">Order Summary Report</h2>
          <div class="print-date">
            Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Customer Name</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order._id ? order._id.substring(0, 8) : 'N/A'}...</td>
                  <td>${order.product && order.product.Character ? order.product.Character : 'N/A'}</td>
                  <td>${order.deliveryInfo && order.deliveryInfo.name ? order.deliveryInfo.name : 'N/A'}</td>
                  <td>Rs. ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                  <td>${order.dateCreated ? formatDate(order.dateCreated) : 'N/A'}</td>
                  <td>
                    <span class="status-badge ${order.status ? order.status.toLowerCase() : 'default'}">
                      ${order.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total-section">
            <span class="total-label">Total</span>
            <span>Rs. ${(orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)).toFixed(2)}</span>
          </div>
          <div class="signature-section">
            <div class="signature-line">...........................................</div>
            Signature
          </div>
          <div class="print-footer">
            Generated by Cropwise System
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500); // Allow images to load
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Added OrderNotifications component */}
          {/* <OrderNotifications onNewOrder={fetchOrders} /> */}
          <Button 
            onClick={generatePDF} 
            color="primary" 
            variant="contained"
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No orders found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} id="order-table">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Order ID</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Product</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Customer Name</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Total Price</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Date</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Status</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id || Math.random()} hover>
                  <TableCell>{order._id ? order._id.substring(0, 8) : 'N/A'}...</TableCell>
                  <TableCell>{order.product && order.product.Character ? order.product.Character : 'N/A'}</TableCell>
                  <TableCell>{order.deliveryInfo && order.deliveryInfo.name ? order.deliveryInfo.name : 'N/A'}</TableCell>
                  <TableCell>Rs. {order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>{order.dateCreated ? formatDate(order.dateCreated) : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status || 'Unknown'} 
                      color={getStatusColor(order.status || 'default')} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<VisibilityOutlined />} 
                      size="small" 
                      onClick={() => handleViewDetails(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Order Details
              </Typography>
              <Chip 
                label={selectedOrder.status || 'Unknown'} 
                color={getStatusColor(selectedOrder.status || 'default')} 
                size="small" 
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Order Information
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Order ID:</strong> {selectedOrder._id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Date:</strong> {selectedOrder.dateCreated ? formatDate(selectedOrder.dateCreated) : 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Customer Information
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Name:</strong> {selectedOrder.deliveryInfo && selectedOrder.deliveryInfo.name ? selectedOrder.deliveryInfo.name : 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Email:</strong> {selectedOrder.deliveryInfo && selectedOrder.deliveryInfo.email ? selectedOrder.deliveryInfo.email : 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Phone:</strong> {selectedOrder.deliveryInfo && selectedOrder.deliveryInfo.phone ? selectedOrder.deliveryInfo.phone : 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Address:</strong> {selectedOrder.deliveryInfo && selectedOrder.deliveryInfo.address ? selectedOrder.deliveryInfo.address : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Product Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Price (Rs.)</TableCell>
                          <TableCell align="right">Quantity (kg)</TableCell>
                          <TableCell align="right">Total (Rs.)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{selectedOrder.product && selectedOrder.product.Character ? selectedOrder.product.Character : 'N/A'}</TableCell>
                          <TableCell align="right">{selectedOrder.product && selectedOrder.product.price ? selectedOrder.product.price : '0.00'}</TableCell>
                          <TableCell align="right">{selectedOrder.quantity || '0'}</TableCell>
                          <TableCell align="right">{selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Showorder;