import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stepper, Step, StepLabel, Button, Typography, TextField, Grid, Paper } from '@mui/material';
import { LocalShipping, PaymentOutlined, CheckCircle } from '@mui/icons-material';
import './Userfee.css';
import PaymentPage from '../Payment_order/PaymentPage'; // Import the PaymentPage component

const Userfee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // Start at delivery info step
  const [orderDetails, setOrderDetails] = useState({
    product: null,
    quantity: 0,
    totalPrice: 0,
    deliveryInfo: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    paymentMethod: '',
    paymentDetails: null
  });

  // Effect to set initial product from navigation state
  useEffect(() => {
    if (location.state && location.state.selectedProduct) {
      setOrderDetails(prev => ({
        ...prev,
        product: location.state.selectedProduct,
        quantity: location.state.selectedProduct.quantity,
        totalPrice: location.state.selectedProduct.price * location.state.selectedProduct.quantity
      }));
    } else {
      navigate('/buy');
    }
  }, [location.state, navigate]);

  const handleQuantityChange = (e) => {
    const enteredQuantity = parseFloat(e.target.value) || 0;
    const maxQuantity = orderDetails.product.quantity;

    // Ensure quantity doesn't exceed available stock or fall below minimum required quantity
    const validQuantity = Math.min(enteredQuantity, maxQuantity);
    
    setOrderDetails(prev => ({
      ...prev,
      quantity: validQuantity,
      totalPrice: validQuantity * prev.product.price
    }));
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    if (activeStep === 1 && validateDeliveryInfo()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      navigate('/buy');
    }
  };

  const validateDeliveryInfo = () => {
    const { name, address, phone, email } = orderDetails.deliveryInfo;
    return (
      name.trim() &&
      address.trim() &&
      phone.trim() &&
      email.trim() &&
      orderDetails.quantity >= 1000 && // Ensure minimum quantity is met
      orderDetails.quantity <= orderDetails.product.quantity // Ensure stock availability
    );
  };

  const handlePaymentSubmit = async (paymentInfo) => {
    try {
      // Update orderDetails with payment information
      const updatedOrderDetails = {
        ...orderDetails,
        paymentMethod: paymentInfo.paymentMethod,
        paymentDetails: paymentInfo.paymentDetails,
        status: 'Pending'
      };
      
      // Send order to the server
      const response = await axios.post('http://localhost:3000/api/orders', updatedOrderDetails);

      if (response.data) {
        setActiveStep(3); // Move to confirmation step
      }
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  const steps = [
    { label: 'Product Details', icon: null },
    { label: 'Delivery Details', icon: <LocalShipping /> },
    { label: 'Payment', icon: <PaymentOutlined /> },
    { label: 'Confirmation', icon: <CheckCircle /> }
  ];

  const renderStepContent = (step) => {
    switch(step) {
      case 1:
        return (
          <Paper elevation={3} className="delivery-form">
            <Typography variant="h6">Delivery Information</Typography>
            {orderDetails.product && (
              <div className="product-summary">
                <Typography variant="subtitle1">
                  Product: {orderDetails.product.Character}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Enter Quantity (kg)"
                      type="number"
                      value={orderDetails.quantity}
                      onChange={handleQuantityChange}
                      inputProps={{
                        min: 1000,
                        max: orderDetails.product.quantity
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      Available Stock: {orderDetails.product.quantity} kg
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" style={{ marginTop: 10 }}>
                  Price: Rs.{orderDetails.product.price} /1kg 
                  | Total Price: Rs. {orderDetails.totalPrice.toFixed(2)}
                </Typography>
              </div>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={orderDetails.deliveryInfo.name}
                  onChange={handleDeliveryInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  value={orderDetails.deliveryInfo.address}
                  onChange={handleDeliveryInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={orderDetails.deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={orderDetails.deliveryInfo.email}
                  onChange={handleDeliveryInfoChange}
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        );
      case 2:
        return (
          <PaymentPage
            orderDetails={{
              product: orderDetails.product,
              quantity: orderDetails.quantity,
              totalPrice: orderDetails.totalPrice
            }}
            onPaymentSubmit={handlePaymentSubmit}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Paper elevation={3} className="confirmation-section">
            <CheckCircle style={{ fontSize: 60, color: 'green', marginBottom: 20 }} />
            <Typography variant="h5" gutterBottom>Order Placed Successfully!</Typography>
            <Typography variant="body1">
              Thank you for your order. Your payment has been processed and your products will be delivered soon.
            </Typography>
            <Typography variant="body2" style={{ marginTop: 20 }}>
              Order details have been sent to: {orderDetails.deliveryInfo.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/buy')}
            >
              Continue Shopping
            </Button>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <div className="userfee-container">
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={() => step.icon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="step-content">
        {renderStepContent(activeStep)}
        
        {/* Show navigation buttons only on step 1 */}
        {activeStep === 1 && (
          <div className="navigation-buttons">
            <Button onClick={handleBack}>
              Back to Products
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleNext}
              disabled={
                orderDetails.quantity <= 999 || 
                orderDetails.quantity > orderDetails.product.quantity ||
                !validateDeliveryInfo()
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userfee;