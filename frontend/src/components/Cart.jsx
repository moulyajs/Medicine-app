import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./CSS/Cart.css";
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from "../features/CartSlice";
import { useEffect } from "react";

const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);
    
    useEffect(() => {
        document.body.classList.add('cart-body');
        return () => { document.body.classList.remove('cart-body'); };
    }, []);

    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem));
    };

    const handleDecreaseCart = (cartItem) => {
        dispatch(decreaseCart(cartItem));
    };

    const handleIncreaseCart = (cartItem) => {
        dispatch(addToCart(cartItem));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className="cart-container">
            <h2>Cart</h2>
            
            {cart.cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is currently empty</p>
                    <div className="go-to-main-page">
                        <Link to="/home">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fillRule="currentColor"
                                className="bi bi-arrow-left"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                                />
                            </svg>
                            <span>Go back to main page</span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="titles">
                        <h3 className="product-title">Product</h3>
                        <h3 className="price">Price</h3>
                        <h3 className="Quantity">Quantity</h3>
                        <h3 className="total">Total</h3>
                    </div>
                    <div className="cart-items">
                        {cart.cartItems?.map((cartItem) => (
                            <div className="cart-item" key={cartItem._id}>
                                <div className="cart-product">
                                    <img
                                        src={`http://localhost:5000${cartItem.image}`}
                                        alt={cartItem.name}
                                    />
                                    <div>
                                        <h3>{cartItem.name}</h3>
                                        <p>{cartItem.quantity} tablet(s) in strip</p>
                                        <button onClick={() => handleRemoveFromCart(cartItem)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-product-price">₹{cartItem.price}</div>
                                <div className="cart-product-quantity">
                                    <button onClick={() => handleDecreaseCart(cartItem)}>-</button>
                                    <div className="count">{cartItem.cartQuantity}</div>
                                    <button onClick={() => handleIncreaseCart(cartItem)}>+</button>
                                </div>
                                <div className="cart-product-total-price">
                                    ₹{cartItem.price * cartItem.cartQuantity}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <button className="clear-cart" onClick={() => handleClearCart()}>
                            Clear cart
                        </button>
                        <div className="cart-checkout">
                            <div className="subtotal">
                                <span>Subtotal</span>
                                <span className="amount">₹{cart.cartTotalAmount}</span>
                            </div>
                            {/* Link to the Checkout page */}
                            <Link to="/checkout">
                                <button className="checkout">Check Out</button>
                            </Link>
                            <div className="main-page">
                                <Link to="/">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fillRule="currentColor"
                                        className="bi bi-arrow-left"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                                        />
                                    </svg>
                                    <span>Go back to main page</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
