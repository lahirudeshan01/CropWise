import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  companyName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00b834',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontSize: '1.2rem',
    color: '#4a5568',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  divider: {
    width: '100px',
    height: '2px',
    backgroundColor: '#2e8b57',
    marginBottom: '1.5rem',
  },
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#2d3748',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#2d3748',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2.5rem',
    outline: 'none',
  },
  dateInput: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='16' y1='2' x2='16' y2='6'/%3E%3Cline x1='8' y1='2' x2='8' y2='6'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    minHeight: '44px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    minHeight: '120px',
    resize: 'vertical',
    outline: 'none',
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '-1rem',
    marginBottom: '1rem',
  },
  unitPriceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.25rem',
  },
  unitPriceSelect: {
    width: '100px',
    flexShrink: 0,
    marginBottom: 0,
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2.5rem',
    outline: 'none',
  },
  unitPriceInput: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 0,
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  button: {
    height: '44px',
    padding: '0 1.25rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  unitPriceButton: {
    width: '44px',
    height: '44px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5c5e5d',
    color: 'white',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    fontSize: '1.25rem',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  unitPriceButtonHover: {
    backgroundColor: '#797a7a',
  },
  unitPriceButtonDisabled: {
    backgroundColor: '#797a7a',
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    marginRight: '1rem',
    width: '625px',
    display: 'inline-block',
    margin: '20px 10px',
    height: '44px',
    padding: '0 1.25rem',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  submitButtonHover: {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
    width: '625px',
    display: 'inline-block',
    margin: '20px 10px',
    height: '44px',
    padding: '0 1.25rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  cancelButtonHover: {
    backgroundColor: '#e2e8f0',
    transform: 'translateY(-1px)',
  },
  mb4: {
    marginBottom: '1rem',
  },
  p4: {
    padding: '1rem',
  },
  text2xl: {
    fontSize: '1.5rem',
  },
  fontBold: {
    fontWeight: 700,
  },
  mediaQuery: {
    '@media (max-width: 640px)': {
      container: {
        margin: '1rem',
        padding: '1.5rem',
      },
      submitButton: {
        width: '100%',
        marginRight: 0,
        marginBottom: '0.5rem',
      },
      cancelButton: {
        width: '100%',
        marginRight: 0,
        marginBottom: '0.5rem',
      },
      unitPriceSelect: {
        width: '80px',
      },
    },
  },
};

const AddInventoryItem = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category: "Fertilizers",
        customCategory: "",
        itemName: "",
        availableAmount: "",
        unit: "Kg",
        expirationDate: "",
        unitPrice: "",
        notes: ""
    });

    const [errors, setErrors] = useState({});
    
    const [hoverStates, setHoverStates] = useState({
        submitButton: false,
        cancelButton: false,
        plusAmount: false,
        minusAmount: false,
        plusPrice: false,
        minusPrice: false
    });

    // Define forbidden symbols
    const forbiddenSymbols = ['@', '#', '$', '*', '=', '+', '~', '^', '`', '|', '{', '}', '[', ']', '<', '>', '"', "'", ':', ';', '**','!','-','?', '.', '_',',','.'];

    const getCurrentDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Add validation for itemName field
        if (name === 'itemName') {
            // Check if the first character is a symbol (not letter or number)
            if (value.length === 1 && !/^[a-zA-Z0-9]/.test(value)) {
                // If it's a symbol as first character, don't update the state
                return;
            }
            
            // Check if any of the entered characters are in the forbidden symbols list
            const lastEnteredChar = value.slice(-1);
            if (forbiddenSymbols.includes(lastEnteredChar)) {
                // If it's a forbidden symbol, don't update the state
                return;
            }
        }
        
        if (name === 'category') {
            let defaultUnit = "Kg";
            if (value === "Farm Machinery & Tools") defaultUnit = "Units";
            setFormData({ 
                ...formData, 
                category: value, 
                unit: defaultUnit,
                availableAmount: ["Farm Machinery & Tools", "Packaging Materials", "Pest Control & Storage Protection", "Other"].includes(value) && defaultUnit === "Units"
                    ? (formData.availableAmount.includes('.')) ? Math.floor(parseFloat(formData.availableAmount)).toString() || "" : formData.availableAmount
                    : formData.availableAmount
            });
        } else if (name === 'unit') {
            setFormData({ 
                ...formData, 
                unit: value,
                availableAmount: value === "Units" 
                    ? (formData.availableAmount.includes('.')) ? Math.floor(parseFloat(formData.availableAmount)).toString() || "" : formData.availableAmount
                    : formData.availableAmount
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (formData.unit === "Units") {
            if (value === '' || /^\d*$/.test(value)) {
                setFormData({ ...formData, availableAmount: value });
            }
        } else {
            if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
                setFormData({ ...formData, availableAmount: value });
            }
        }
    };

    const handleUnitPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData({ ...formData, unitPrice: value });
        }
    };

    const handleUnitPriceBlur = () => {
        if (formData.unitPrice) {
            const num = parseFloat(formData.unitPrice);
            if (!isNaN(num)) {
                setFormData({ ...formData, unitPrice: num.toFixed(2) });
            }
        }
    };

    const adjustAmount = (increment) => {
        let currentValue = parseFloat(formData.availableAmount) || 0;
        if (formData.unit === "Units") {
            currentValue = Math.floor(currentValue) + increment;
        } else {
            const decimalPart = currentValue % 1;
            currentValue = Math.floor(currentValue) + increment + decimalPart;
        }
        
        if (currentValue < 0) currentValue = 0;
        
        const newValue = formData.unit === "Units" 
            ? currentValue.toString() 
            : (currentValue % 1 === 0 ? currentValue.toString() : currentValue.toFixed(3).replace(/\.?0+$/, ''));
        
        setFormData({ ...formData, availableAmount: newValue });
    };

    const adjustUnitPrice = (increment) => {
        let currentValue = parseFloat(formData.unitPrice) || 0;
        currentValue += increment;
        
        if (currentValue < 0) currentValue = 0;
        
        setFormData({ ...formData, unitPrice: currentValue.toFixed(2) });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item Name is required.";
            isValid = false;
        } else if (!/^[a-zA-Z0-9]/.test(formData.itemName)) {
            newErrors.itemName = "Item Name must start with a letter or number.";
            isValid = false;
        }

        if (!formData.availableAmount || isNaN(formData.availableAmount) || parseFloat(formData.availableAmount) <= 0) {
            newErrors.availableAmount = "Available Amount must be a positive number.";
            isValid = false;
        }

        if (formData.unit === "Units" && formData.availableAmount.includes('.')) {
            newErrors.availableAmount = "Available Amount must be a whole number when Units is selected.";
            isValid = false;
        }

        if (!["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) && 
            (!formData.expirationDate || new Date(formData.expirationDate) <= new Date())) {
            newErrors.expirationDate = "Expiration Date must be a future date.";
            isValid = false;
        }

        if (!formData.unitPrice || isNaN(formData.unitPrice) || parseFloat(formData.unitPrice) <= 0) {
            newErrors.unitPrice = "Unit Price must be a positive number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const getAvailableUnits = () => {
        switch(formData.category) {
            case "Fertilizers":
            case "Pesticides":
                return ["Kg", "Liters"];
            case "Seeds":
                return ["Kg"];
            case "Packaging Materials":
                return ["Kg", "Units"];
            case "Farm Machinery & Tools":
                return ["Units"];
            case "Pest Control & Storage Protection":
            case "Other":
                return ["Kg", "Liters", "Units"];
            default:
                return ["Kg", "Liters", "Units"];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalCategory = formData.category === "Other" ? (formData.customCategory || "Other") : formData.category;

        const newItem = {
            category: finalCategory,
            itemName: formData.itemName,
            availableAmount: parseFloat(formData.availableAmount),
            unit: formData.unit,
            expirationDate: ["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) ? null : formData.expirationDate,
            unitPrice: parseFloat(formData.unitPrice),
            notes: formData.notes
        };

        try {
            await axios.post("http://localhost:3000/api/inventory", newItem);
            navigate("/inventryshow");
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    const availableUnits = getAvailableUnits();

    const showExpirationDate = !["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.companyName}>CropWise</h1>
                <p style={styles.tagline}>Smart Agriculture</p>
                <div style={styles.divider}></div>
            </div>
            
            <h1 style={{...styles.heading, ...styles.mb4, ...styles.text2xl, ...styles.fontBold}}>Add Your New Inventory Item</h1>
            <form style={styles.form} onSubmit={handleSubmit}>
                <label style={styles.label}>Item Category</label>
                <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Farm Machinery & Tools">Farm Machinery & Tools</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                    <option value="Pest Control & Storage Protection">Pest Control & Storage Protection</option>
                    <option value="Other">Other</option>
                </select>
               
                <label style={styles.label}>Item Name</label>
                <input 
                    name="itemName" 
                    value={formData.itemName} 
                    onChange={handleChange} 
                    style={styles.input}
                    placeholder="Enter item name (must start with letter or number)"
                />
                {errors.itemName && <p style={styles.errorMessage}>{errors.itemName}</p>}

                <label style={styles.label}>Available Amount</label>
                <div style={styles.unitPriceContainer}>
                    <button 
                        type="button" 
                        style={{
                            ...styles.unitPriceButton,
                            ...((!formData.availableAmount || parseFloat(formData.availableAmount) <= 0) ? styles.unitPriceButtonDisabled : {}),
                            ...(hoverStates.minusAmount ? styles.unitPriceButtonHover : {})
                        }} 
                        onClick={() => adjustAmount(-1)}
                        disabled={!formData.availableAmount || parseFloat(formData.availableAmount) <= 0}
                        onMouseEnter={() => setHoverStates({...hoverStates, minusAmount: true})}
                        onMouseLeave={() => setHoverStates({...hoverStates, minusAmount: false})}
                    >
                        -
                    </button>
                    <input 
                        type="text" 
                        name="availableAmount" 
                        value={formData.availableAmount} 
                        onChange={handleAmountChange}
                        style={styles.unitPriceInput}
                        placeholder="0"
                    />
                    <button 
                        type="button" 
                        style={{
                            ...styles.unitPriceButton,
                            ...(hoverStates.plusAmount ? styles.unitPriceButtonHover : {})
                        }}
                        onClick={() => adjustAmount(1)}
                        onMouseEnter={() => setHoverStates({...hoverStates, plusAmount: true})}
                        onMouseLeave={() => setHoverStates({...hoverStates, plusAmount: false})}
                    >
                        +
                    </button>
                    <select 
                        name="unit" 
                        value={formData.unit} 
                        onChange={handleChange} 
                        disabled={availableUnits.length === 1}
                        style={styles.unitPriceSelect}
                    >
                        {availableUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                {errors.availableAmount && <p style={styles.errorMessage}>{errors.availableAmount}</p>}

                {showExpirationDate && (
                    <>
                        <label style={styles.label}>Expiration Date</label>
                        <input 
                            type="date" 
                            name="expirationDate" 
                            value={formData.expirationDate} 
                            onChange={handleChange} 
                            min={getCurrentDate()}
                            style={styles.dateInput}
                        />
                        {errors.expirationDate && (
                            <p style={styles.errorMessage}>{errors.expirationDate}</p>
                        )}
                    </>
                )}

                <label style={styles.label}>Unit Price (RS.)</label>
                <div style={styles.unitPriceContainer}>
                    <button 
                        type="button"
                        style={{
                            ...styles.unitPriceButton,
                            ...((!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) ? styles.unitPriceButtonDisabled : {}),
                            ...(hoverStates.minusPrice ? styles.unitPriceButtonHover : {})
                        }}
                        onClick={() => adjustUnitPrice(-1)}
                        disabled={!formData.unitPrice || parseFloat(formData.unitPrice) <= 0}
                        onMouseEnter={() => setHoverStates({...hoverStates, minusPrice: true})}
                        onMouseLeave={() => setHoverStates({...hoverStates, minusPrice: false})}
                    >
                        -
                    </button>
                    <input 
                        type="text" 
                        name="unitPrice" 
                        value={formData.unitPrice} 
                        onChange={handleUnitPriceChange}
                        onBlur={handleUnitPriceBlur}
                        style={styles.unitPriceInput}
                        placeholder="0.00"
                    />
                    <button 
                        type="button"
                        style={{
                            ...styles.unitPriceButton,
                            ...(hoverStates.plusPrice ? styles.unitPriceButtonHover : {})
                        }}
                        onClick={() => adjustUnitPrice(1)}
                        onMouseEnter={() => setHoverStates({...hoverStates, plusPrice: true})}
                        onMouseLeave={() => setHoverStates({...hoverStates, plusPrice: false})}
                    >
                        +
                    </button>
                </div>
                {errors.unitPrice && <p style={styles.errorMessage}>{errors.unitPrice}</p>}

                <label style={styles.label}>Notes</label>
                <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange}
                    style={styles.textarea}
                />

                <button 
                    type="submit" 
                    style={{
                        ...styles.submitButton,
                        ...(hoverStates.submitButton ? styles.submitButtonHover : {})
                    }}
                    onMouseEnter={() => setHoverStates({...hoverStates, submitButton: true})}
                    onMouseLeave={() => setHoverStates({...hoverStates, submitButton: false})}
                >
                    Add Item
                </button>
                
                <button 
                    type="button" 
                    onClick={() => navigate("/inventryshow")} 
                    style={{
                        ...styles.cancelButton,
                        ...(hoverStates.cancelButton ? styles.cancelButtonHover : {})
                    }}
                    onMouseEnter={() => setHoverStates({...hoverStates, cancelButton: true})}
                    onMouseLeave={() => setHoverStates({...hoverStates, cancelButton: false})}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddInventoryItem;