import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LocalShipping,
  PaymentOutlined,
  CheckCircle,
} from "@mui/icons-material";
import "./Userfee.css";
import PaymentPage from "../Payment_order/PaymentPage";

const Userfee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    product: null,
    quantity: 0,
    totalPrice: 0,
    deliveryInfo: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
    paymentMethod: "",
    paymentDetails: null,
  });
  
  // Add state for notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" // can be "error", "warning", "info", "success"
  });

  // Effect to set initial product from navigation state
  useEffect(() => {
    if (location.state && location.state.selectedProduct) {
      setOrderDetails((prev) => ({
        ...prev,
        product: location.state.selectedProduct,
        quantity: location.state.selectedProduct.quantity,
        totalPrice:
          location.state.selectedProduct.price *
          location.state.selectedProduct.quantity,
      }));
    } else {
      navigate("/buy");
    }
  }, [location.state, navigate]);

  const handleQuantityChange = (e) => {
    const enteredQuantity = parseFloat(e.target.value) || 0;
    const maxQuantity = orderDetails.product.quantity;
    const validQuantity = Math.min(enteredQuantity, maxQuantity);

    setOrderDetails((prev) => ({
      ...prev,
      quantity: validQuantity,
      totalPrice: validQuantity * prev.product.price,
    }));
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: value,
      },
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
      navigate("/buy");
    }
  };

  const validateDeliveryInfo = () => {
    const { name, address, phone, email } = orderDetails.deliveryInfo;
    return (
      name.trim() &&
      address.trim() &&
      phone.trim() &&
      email.trim() &&
      orderDetails.quantity >= 1000 &&
      orderDetails.quantity <= orderDetails.product.quantity
    );
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handlePaymentSubmit = async (paymentInfo) => {
    try {
      const orderData = {
        product: orderDetails.product,
        quantity: orderDetails.quantity,
        totalPrice: orderDetails.totalPrice,
        deliveryInfo: {
          name: orderDetails.deliveryInfo.name,
          address: orderDetails.deliveryInfo.address,
          phone: orderDetails.deliveryInfo.phone,
          email: orderDetails.deliveryInfo.email,
        },
        paymentMethod: paymentInfo.paymentMethod,
        paymentDetails: paymentInfo.paymentDetails,
        status: "Pending",
      };
  
      // Send order to the server
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData
      );
  
      if (response.data && response.data.success) {
        // Show success notification
        setNotification({
          open: true,
          message: "Order added successfully!",
          severity: "success"
        });
        setActiveStep(3); // Move to confirmation step
      } else {
        // Show error notification if response exists but success is false
        setNotification({
          open: true,
          message: response.data.message || "Failed to add order",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      // Show error notification
      setNotification({
        open: true,
        message: error.response?.data?.message || "Order placement failed",
        severity: "error"
      });
    }
  };

  const steps = [
    { label: "Product Details", icon: null },
    { label: "Delivery Details", icon: <LocalShipping /> },
    { label: "Payment", icon: <PaymentOutlined /> },
    { label: "Confirmation", icon: <CheckCircle /> },
  ];

  const renderStepContent = (step) => {
    switch (step) {
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
                        max: orderDetails.product.quantity,
                      }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/^0+/, "");
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
                  Price: Rs.{orderDetails.product.price} /1kg | Total Price: Rs.{" "}
                  {orderDetails.totalPrice.toFixed(2)}
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
                  type="number"
                  value={orderDetails.deliveryInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleDeliveryInfoChange({
                        target: {
                          name: e.target.name,
                          value: value,
                        },
                      });
                    }
                  }}
                  error={
                    orderDetails.deliveryInfo.phone.length > 0 &&
                    orderDetails.deliveryInfo.phone.length !== 10
                  }
                  helperText={
                    orderDetails.deliveryInfo.phone.length > 0 &&
                    orderDetails.deliveryInfo.phone.length !== 10
                      ? "Phone number must be exactly 10 digits"
                      : ""
                  }
                  inputProps={{ maxLength: 10 }}
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
              totalPrice: orderDetails.totalPrice,
            }}
            onPaymentSubmit={handlePaymentSubmit}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Paper elevation={3} className="confirmation-section">
            <CheckCircle
              style={{ fontSize: 60, color: "green", marginBottom: 20 }}
            />
            <Typography variant="h5" gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1">
              Thank you for your order. Your payment has been processed and your
              products will be delivered soon.
            </Typography>
            <Typography variant="body2" style={{ marginTop: 20 }}>
              Order details have been sent to: {orderDetails.deliveryInfo.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              onClick={() => navigate("/buy")}
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
            <Button onClick={handleBack}>Back to Products</Button>
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
      
      {/* Notification system */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Userfee;