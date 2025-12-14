import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/apiUtils";
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
  
  // Add state for validation errors
  const [errors, setErrors] = useState({
    quantity: "",
    name: "",
    address: "",
    phone: "",
    email: ""
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

    // Validate quantity
    let quantityError = "";
    if (validQuantity < 1000) {
      quantityError = "Minimum order quantity is 1000 kg";
    } else if (validQuantity > maxQuantity) {
      quantityError = `Maximum available quantity is ${maxQuantity} kg`;
    }

    setErrors(prev => ({
      ...prev,
      quantity: quantityError
    }));

    setOrderDetails((prev) => ({
      ...prev,
      quantity: validQuantity,
      totalPrice: validQuantity * prev.product.price,
    }));
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for different fields
    let error = "";
    
    if (name === "name") {
      // Only allow letters and spaces
      const onlyLettersAndSpaces = /^[A-Za-z\s]*$/;
      if (!onlyLettersAndSpaces.test(value)) {
        error = "Name can only contain letters";
        // Don't update the field if invalid
        return;
      }
    }
    
    if (name === "phone") {
      // Only allow digits
      const onlyDigits = /^\d*$/;
      if (!onlyDigits.test(value)) {
        return; // Ignore non-digit input
      }
      
      if (value.length > 0 && value.length !== 10) {
        error = "Phone number must be exactly 10 digits";
      }
    }
    
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }
    
    // Update error state
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Update form data
    setOrderDetails((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate all fields before proceeding
      const formErrors = validateAllFields();
      
      if (Object.values(formErrors).every(error => error === "")) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        // Update errors state to display all validation errors
        setErrors(formErrors);
        
        // Show notification for validation errors
        setNotification({
          open: true,
          message: "Please fix the errors in the form before proceeding",
          severity: "error"
        });
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      navigate("/buy");
    }
  };

  const validateAllFields = () => {
    const { name, address, phone, email } = orderDetails.deliveryInfo;
    const { quantity, product } = orderDetails;
    
    const formErrors = {
      quantity: "",
      name: "",
      address: "",
      phone: "",
      email: ""
    };
    
    // Validate quantity
    if (quantity < 1000) {
      formErrors.quantity = "Minimum order quantity is 1000 kg";
    } else if (product && quantity > product.quantity) {
      formErrors.quantity = `Maximum available quantity is ${product.quantity} kg`;
    }
    
    // Validate name
    if (!name.trim()) {
      formErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]*$/.test(name)) {
      formErrors.name = "Name can only contain letters";
    }
    
    // Validate address
    if (!address.trim()) {
      formErrors.address = "Address is required";
    }
    
    // Validate phone
    if (!phone.trim()) {
      formErrors.phone = "Phone number is required";
    } else if (phone.length !== 10) {
      formErrors.phone = "Phone number must be exactly 10 digits";
    }
    
    // Validate email
    if (!email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formErrors.email = "Please enter a valid email address";
    }
    
    return formErrors;
  };

  const validateDeliveryInfo = () => {
    const { name, address, phone, email } = orderDetails.deliveryInfo;
    const { quantity, product } = orderDetails;
    
    // Check if there are any validation errors
    return (
      name.trim() &&
      address.trim() &&
      phone.trim() &&
      phone.length === 10 &&
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      quantity >= 1000 &&
      product && quantity <= product.quantity &&
      Object.values(errors).every(error => error === "")
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
          name: orderDetails.deliveryInfo.name.trim(),
          address: orderDetails.deliveryInfo.address.trim(),
          phone: orderDetails.deliveryInfo.phone.trim(),
          email: orderDetails.deliveryInfo.email.toLowerCase().trim(),
        },
        paymentMethod: paymentInfo.paymentMethod,
        paymentDetails: paymentInfo.paymentDetails,
        status: "Pending",
        farmerId: orderDetails.product._id, // Add the farmer listing ID
      };

      console.log('Sending order data:', orderData);
      console.log('Product ID (farmerId):', orderDetails.product._id);
  
      // Send order to the server
      const response = await api.post(
        "/api/orders",
        orderData
      );

      console.log('Order response:', response.data);
  
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
                      error={!!errors.quantity}
                      helperText={errors.quantity}
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
                  type="text"
                  label="Full Name"
                  name="name"
                  value={orderDetails.deliveryInfo.name}
                  onChange={handleDeliveryInfoChange}
                  error={!!errors.name}
                  helperText={errors.name}
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
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="text"
                  value={orderDetails.deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  error={!!errors.phone}
                  helperText={errors.phone || "Must be exactly 10 digits"}
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
                  error={!!errors.email}
                  helperText={errors.email}
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
              disabled={!validateDeliveryInfo()}
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