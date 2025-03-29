import React, { useState } from 'react';
import { 
  Paper, Typography, Grid, RadioGroup, Radio, 
  FormControlLabel, TextField, Button, Box, 
  FormControl, FormLabel, Divider, Alert
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';

const PaymentPage = ({ orderDetails, onPaymentSubmit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentDetails, setPaymentDetails] = useState({
    // Credit Card details
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    
    // Bank Transfer details
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    
    // Cash on Delivery
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentMethod === 'creditCard') {
      if (!paymentDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(paymentDetails.cardNumber)) newErrors.cardNumber = 'Enter a valid 16-digit card number';
      
      if (!paymentDetails.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
      if (!paymentDetails.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
      
      if (!paymentDetails.cvv) newErrors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';
    } 
    else if (paymentMethod === 'bankTransfer') {
      if (!paymentDetails.accountName) newErrors.accountName = 'Account name is required';
      if (!paymentDetails.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!paymentDetails.bankName) newErrors.bankName = 'Bank name is required';
      if (!paymentDetails.ifscCode) newErrors.ifscCode = 'IFSC code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validatePayment()) {
      onPaymentSubmit({
        paymentMethod,
        paymentDetails: { ...paymentDetails }
      });
    }
  };

  return (
    <Paper elevation={3} className="payment-form" sx={{ padding: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Payment Information
      </Typography>
      
      {/* Order Summary */}
      <Box sx={{ mb: 3, bgcolor: '#f8f8f8', p: 2, borderRadius: 1 }}>
        <Typography variant="h6">Order Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Product:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              {orderDetails?.product?.Character || 'Product Name'}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body1">Quantity:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              {orderDetails?.quantity || 0} kg
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body1">Price per kg:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Rs. {orderDetails?.product?.price || 0}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body1">Total Amount:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Rs. {orderDetails?.totalPrice?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Payment Method Selection */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          row
        >
          <FormControlLabel 
            value="creditCard" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>Credit/Debit Card</Typography>
              </Box>
            } 
          />
          <FormControlLabel 
            value="bankTransfer" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography>Bank Transfer</Typography>
              </Box>
            } 
          />
          <FormControlLabel 
            value="cod" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1 }} />
                <Typography>Cash on Delivery</Typography>
              </Box>
            } 
          />
        </RadioGroup>
      </FormControl>
      
      {/* Credit Card Payment Form */}
      {paymentMethod === 'creditCard' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              name="cardholderName"
              value={paymentDetails.cardholderName}
              onChange={handleInputChange}
              error={!!errors.cardholderName}
              helperText={errors.cardholderName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVV"
              name="cvv"
              type="password"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
              error={!!errors.cvv}
              helperText={errors.cvv}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
        </Grid>
      )}
      
      {/* Bank Transfer Form */}
      {paymentMethod === 'bankTransfer' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account Holder Name"
              name="accountName"
              value={paymentDetails.accountName}
              onChange={handleInputChange}
              error={!!errors.accountName}
              helperText={errors.accountName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              value={paymentDetails.accountNumber}
              onChange={handleInputChange}
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={paymentDetails.bankName}
              onChange={handleInputChange}
              error={!!errors.bankName}
              helperText={errors.bankName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="IFSC Code"
              name="ifscCode"
              value={paymentDetails.ifscCode}
              onChange={handleInputChange}
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
            />
          </Grid>
        </Grid>
      )}
      
      {/* Cash on Delivery Form */}
      {paymentMethod === 'cod' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Alert severity="info">
              You will pay the amount of Rs. {orderDetails?.totalPrice?.toFixed(2) || '0.00'} when your order is delivered.
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes (Optional)"
              name="notes"
              multiline
              rows={3}
              value={paymentDetails.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions for delivery"
            />
          </Grid>
        </Grid>
      )}
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
        >
          Place Order
        </Button>
      </Box>
    </Paper>
  );
};

export default PaymentPage;