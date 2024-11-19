import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/CartSlice"; // Import the action
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CSS/CheckOut.css"; // Add your styles for the checkout page

const CheckOut = () => {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: "",
    });

    useEffect(() => {
        document.body.classList.add('checkout-body');
        return () => { document.body.classList.remove('checkout-body'); };
    }, []);

    const [modalVisible, setModalVisible] = useState(false); // For showing the confirmation modal
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /*const handleConfirmOrder = () => {
        // Clear the cart after confirming the order
        dispatch(clearCart());
        
        // Show the confirmation modal
        setModalVisible(true);
        
        // Redirect back to the cart page after a delay (optional)
        setTimeout(() => {
            navigate("/cart");
        }, 5000); // You can set a delay if you want to show the modal before redirecting
    };*/

    const handleClose = () => {
        // Close the checkout and navigate back to the cart without placing the order
        navigate("/cart");
    };

    const handleModalClose = () => {
        setModalVisible(false); // Close the modal
        setFormData({
            name: "",
            mobile: "",
            address: "",
        });
        navigate("/cart");
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!formData.name || !formData.mobile || !formData.address) {
            alert("Please fill out all the required fields.");
            return;
        }
    
        // Clear the cart after confirming the order
        dispatch(clearCart());
    
        // Show the confirmation modal
        setModalVisible(true);
    
        // Redirect back to the cart page after a delay (optional)
        setTimeout(() => {
            navigate("/cart");
        }, 5000); // You can set a delay if you want to show the modal before redirecting
    };
    

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                        type="text"
                        value={formData.mobile}
                        onChange={handleChange}
                        name="mobile"
                         pattern="\d{10}" 
                        maxLength="10"
                        title="Mobile number must be exactly 10 digits."

                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        value={formData.address}
                        onChange={handleChange}
                        name="address"
                        required
                    ></textarea>
                </div>
                <div className="payment-method">
                    <label>Payment Method: Pay on Delivery</label>
                </div>
                <button type="submit" className="confirm-order-btn">
                    Confirm Order
                </button>
            </form>

            {/* Modal for confirmation */}
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Order Placed!</h3>
                        <p>Your order has been successfully placed. It will be delivered within 5 hours.</p>
                        <button onClick={handleModalClose} className="modal-close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Close button to go back to cart */}
            <button onClick={handleClose} className="close-btn">Close</button>
        </div>
    );
};

export default CheckOut;
