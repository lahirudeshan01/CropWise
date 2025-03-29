// import React, { useState } from 'react';
// import './ProductSelection.css';
// import { Add, Remove, ShoppingCart } from '@mui/icons-material';

// const ProductSelection = ({ products, onProductSelect }) => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(0);

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//     setQuantity(1);
//     setTotalPrice(product.price * 1);
//   };

//   const handleQuantityChange = (type) => {
//     if (type === 'increase' && quantity < selectedProduct.quantity) {
//       const newQuantity = quantity + 1;
//       setQuantity(newQuantity);
//       setTotalPrice(selectedProduct.price * newQuantity);
//     } else if (type === 'decrease' && quantity > 1) {
//       const newQuantity = quantity - 1;
//       setQuantity(newQuantity);
//       setTotalPrice(selectedProduct.price * newQuantity);
//     }
//   };

//   const handleAddToOrder = () => {
//     if (selectedProduct && quantity > 0) {
//       onProductSelect({
//         ...selectedProduct,
//         selectedQuantity: quantity,
//         totalPrice: totalPrice
//       });
//     }
//   };

//   return (
//     <div className="product-selection-container">
//       <div className="product-grid">
//         {products.map((product) => (
//           <div 
//             key={product._id} 
//             className={`product-card ${selectedProduct?._id === product._id ? 'selected' : ''}`}
//             onClick={() => handleProductSelect(product)}
//           >
//             <img 
//               src={`http://localhost:3000/uploads/${product.image}`} 
//               alt={`${product.Character} Harvest`} 
//               className="product-image"
//             />
//             <div className="product-details">
//               <h3>Product: {product.Character}</h3>
//               <p>Variety: {product.verity}</p>
//               <p>Available Quantity: {product.quantity} kg</p>
//               <p>Price: Rs. {product.price}/kg</p>
//               <p>Location: {product.location}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedProduct && (
//         <div className="quantity-section">
//           <h3>Selected Product: {selectedProduct.Character}</h3>
//           <div className="quantity-controls">
//             <div className="quantity-input">
//               <button onClick={() => handleQuantityChange('decrease')}>
//                 <Remove />
//               </button>
//               <input 
//                 type="number" 
//                 value={quantity}
//                 readOnly
//               />
//               <button onClick={() => handleQuantityChange('increase')}>
//                 <Add />
//               </button>
//             </div>
//             <div className="price-summary">
//               <p>Unit Price: Rs. {selectedProduct.price}/kg</p>
//               <p>Max Available: {selectedProduct.quantity} kg</p>
//               <p>Total Price: Rs. {totalPrice}</p>
//             </div>
//             <button className="add-to-order" onClick={handleAddToOrder}>
//               <ShoppingCart /> Add to Order
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductSelection;