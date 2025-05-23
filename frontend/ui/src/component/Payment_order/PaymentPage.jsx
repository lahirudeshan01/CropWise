import React, { useState } from 'react';
import { 
  Paper, Typography, Grid, RadioGroup, Radio, 
  FormControlLabel, TextField, Button, Box, 
  FormControl, FormLabel, Divider, Alert,
  InputAdornment, Card, CardContent, Chip,
  Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentPage = ({ orderDetails, onPaymentSubmit, onBack }) => {
  const navigate = useNavigate();
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
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    // Clear errors when changing payment method
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for card number - only allow numbers
    if (name === 'cardNumber') {
      // Remove any non-digit characters
      const numbersOnly = value.replace(/\D/g, '');
      // Limit to 16 digits
      const limitedValue = numbersOnly.slice(0, 16);
      
      setPaymentDetails({
        ...paymentDetails,
        [name]: limitedValue
      });
    }
    // Special handling for cardholder name - only allow letters and spaces
    else if (name === 'cardholderName') {
      // Only allow letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setPaymentDetails({
          ...paymentDetails,
          [name]: value
        });
      }
      // If the input doesn't match the pattern, don't update the state
    }
    // Special handling for expiry date to format as MM/YY
    else if (name === 'expiryDate') {
      // Remove any non-digit characters
      const cleaned = value.replace(/\D/g, '');
      
      // Format as MM/YY
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      
      setPaymentDetails({
        ...paymentDetails,
        [name]: formatted
      });
    } else {
      setPaymentDetails({
        ...paymentDetails,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Update the validatePayment function
  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentMethod === 'creditCard') {
      // Card number validation - between 5 and 16 digits
      if (!paymentDetails.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{5,16}$/.test(paymentDetails.cardNumber)) {
        newErrors.cardNumber = 'Card number must be between 5 and 16 digits';
      }
      
      // Cardholder name validation - only allow letters
      if (!paymentDetails.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required';
      } else if (!/^[A-Za-z\s]+$/.test(paymentDetails.cardholderName)) {
        newErrors.cardholderName = 'Name can only contain letters';
      }
      
      // Expiry date validation
      if (!paymentDetails.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
        newErrors.expiryDate = 'Use MM/YY format';
      } else {
        // Check if date is in the past or too far in the future
        const [month, year] = paymentDetails.expiryDate.split('/');
        const expYear = 2000 + parseInt(year, 10);
        const expMonth = parseInt(month, 10) - 1; // JS months are 0-indexed
        const expDate = new Date(expYear, expMonth, 1);
        const today = new Date();
        const maxDate = new Date();
        
        // Set max date to 5 years from now (2030)
        maxDate.setFullYear(maxDate.getFullYear() + 5);
        
        // Set today to the beginning of the month for accurate comparison
        today.setDate(1);
        today.setHours(0, 0, 0, 0);
        
        if (expDate < today) {
          newErrors.expiryDate = 'Card has expired';
        } else if (expDate > maxDate) {
          newErrors.expiryDate = 'Expiry date cannot exceed 5 years from now';
        }
        
        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
          newErrors.expiryDate = 'Invalid month';
        }
      }
      
      // CVV validation - maximum 3 digits
      if (!paymentDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3}$/.test(paymentDetails.cvv)) {
        newErrors.cvv = 'CVV must be exactly 3 digits';
      }
    } 
    else if (paymentMethod === 'bankTransfer') {
      // Account name validation
      if (!paymentDetails.accountName) {
        newErrors.accountName = 'Account name is required';
      }
      
      // Account number validation
      if (!paymentDetails.accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      } else if (paymentDetails.accountNumber.length < 5) {
        newErrors.accountNumber = 'Account number must be at least 5 digits';
      } else if (paymentDetails.accountNumber.length > 16) {
        newErrors.accountNumber = 'Account number cannot exceed 16 digits';
      }
      
      // Bank name validation
      if (!paymentDetails.bankName) {
        newErrors.bankName = 'Bank name is required';
      }
      
      // IFSC code validation
      if (!paymentDetails.ifscCode) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentDetails.ifscCode)) {
        newErrors.ifscCode = 'Enter a valid IFSC code (e.g., SBIN0123456)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validatePayment()) {
      // Show confirmation dialog
      setOpenConfirmation(true);
    }
  };
  
  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
    
    // Send payment details to parent component
    onPaymentSubmit({
      paymentMethod,
      paymentDetails: { ...paymentDetails }
    });
    
    // Navigate to home page
    navigate('/');
  };

  // Format card number with spaces for display
  const formatCardNumberForDisplay = (cardNumber) => {
    if (!cardNumber) return '';
    const digits = cardNumber.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ').trim();
  };

  return (
    <>
      <Paper elevation={3} className="payment-form" sx={{ 
        padding: 4, 
        maxWidth: '800px', 
        margin: '0 auto',
        borderRadius: '12px'
      }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Payment Information
        </Typography>
        
        {/* Order Summary */}
        <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" mb={2}>Order Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="text.secondary">Product:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="500">
                  {orderDetails?.product?.Character || 'Product Name'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body1" color="text.secondary">Quantity:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="500">
                  {orderDetails?.quantity || 0} kg
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body1" color="text.secondary">Price per kg:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="500">
                  Rs. {orderDetails?.product?.price || 0}
                </Typography>
              </Grid>
              
              <Divider sx={{ width: '100%', my: 1.5 }} />
              
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="600" color="text.secondary">Total Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="600" color="primary.main">
                  Rs. {orderDetails?.totalPrice?.toFixed(2) || '0.00'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Payment Method Selection */}
        <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Select Payment Method</FormLabel>
          <RadioGroup
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            row
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              '& .MuiFormControlLabel-root': {
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px',
                margin: '4px',
                flex: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              },
              '& .Mui-checked + .MuiFormControlLabel-label': {
                fontWeight: 500
              }
            }}
          >
            <FormControlLabel 
              value="creditCard" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>Credit/Debit Card</Typography>
                </Box>
              } 
            />
            <FormControlLabel 
              value="bankTransfer" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>Bank Transfer</Typography>
                </Box>
              } 
            />
            <FormControlLabel 
              value="cod" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>Cash on Delivery</Typography>
                </Box>
              } 
            />
          </RadioGroup>
        </FormControl>
        
        {/* Credit Card Payment Form */}
        {paymentMethod === 'creditCard' && (
          <Box sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px',
            position: 'relative'
          }}>
            <Chip 
              icon={<SecurityIcon />} 
              label="Secure Payment" 
              color="success" 
              size="small"
              sx={{ 
                position: 'absolute', 
                top: -12, 
                right: 16
              }}
            />
            <Grid container spacing={3}>
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
                  inputProps={{ 
                    maxLength: 16,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CreditCardIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  placeholder="As it appears on your card"
                  inputProps={{
                    pattern: '[A-Za-z\\s]*'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  inputProps={{ 
                    maxLength: 3,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Bank Transfer Form */}
        {paymentMethod === 'bankTransfer' && (
          <Box sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px' 
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  name="accountName"
                  value={paymentDetails.accountName}
                  onChange={handleInputChange}
                  error={!!errors.accountName}
                  helperText={errors.accountName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  placeholder="Enter a 5-16 digit account number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
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
                  helperText={errors.ifscCode || "E.g., SBIN0123456"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Cash on Delivery Form */}
        {paymentMethod === 'cod' && (
          <Box sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px' 
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiAlert-message': { 
                      fontWeight: 500 
                    }
                  }}
                >
                  You will pay the amount of Rs. {orderDetails?.totalPrice?.toFixed(2) || '0.00'} when your order is delivered.
                </Alert>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  name="notes"
                  multiline
                  rows={3}
                  value={paymentDetails.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Security Note */}
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <LockIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="caption">
            Your payment information is secure and encrypted. We never store your complete card details.
          </Typography>
        </Box>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            sx={{ 
              borderRadius: '8px',
              px: 3
            }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            sx={{ 
              borderRadius: '8px',
              px: 4,
              py: 1.2,
              fontWeight: 500
            }}
          >
            Place Order
          </Button>
        </Box>
      </Paper>
      
      {/* Order Success Dialog */}
      <Dialog
        open={openConfirmation}
        onClose={handleConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxWidth: '500px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: 'success.main' 
        }}>
          <CheckCircleIcon sx={{ fontSize: 32, mr: 1.5 }} />
          Order Successfully Placed
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Thank you for your order! Your payment has been processed successfully.
            {paymentMethod === 'cod' ? 
              ' You will pay the total amount upon delivery.' : 
              ' A confirmation email with your order details has been sent to your registered email address.'}
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
            <Typography variant="subtitle2" gutterBottom>
              Order Summary:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Product:</Typography>
              <Typography variant="body2" fontWeight="500">
                {orderDetails?.product?.Character || 'Product Name'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Quantity:</Typography>
              <Typography variant="body2" fontWeight="500">
                {orderDetails?.quantity || 0} kg
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
              <Typography variant="body2" fontWeight="600" color="primary.main">
                Rs. {orderDetails?.totalPrice?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleConfirmationClose} 
            autoFocus 
            variant="contained" 
            sx={{ 
              borderRadius: '8px',
              minWidth: '100px'
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentPage;