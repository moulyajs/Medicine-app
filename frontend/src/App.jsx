// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/signin';
import SignUp from './components/signup';
import { ForgotPassword, ResetPasswordWrapper } from './components/passforgot';
import DosageCalculator from './components/dosage';
import { isAuthenticated, logout } from './features/auth';
import HomePage from "./components/Home";
import Main from "./components/Main";
import Search from "./components/search";
import Cart from "./components/Cart";
import Specialists from "./components/Specialists";
import SpecialistDoctors from "./components/SpecialistDoctors";
import CheckOut from "./components/CheckOut";
import "./App.css"

class App extends Component 
{
    state = { authenticated: false };

    async componentDidMount() {
        const authStatus = await isAuthenticated();
        this.setState({ authenticated: authStatus });
    }

    handleLogout = async () => {
        const loggedOut = await logout();
        if (loggedOut) 
        {
            this.setState({ authenticated: false });
            window.localStorage.removeItem("isLoggedIn");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert("Thank you for visiting Dr.PillPilot...");
        } else { alert('Logout failed. Please try again.'); }
    };

    handleLoginSuccess = () => { this.setState({ authenticated: true }); };

    render() 
    {
        return (
            <Router>
                <div>
                    <ToastContainer />
                    <Navigation
                        authenticated={this.state.authenticated}
                        handleLogout={this.handleLogout}
                    />
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/home" element={this.state.authenticated ? <HomePage /> : <Navigate to="/login" />} />
                        <Route path="/account" element={this.state.authenticated ? <DosageCalculator /> : <Navigate to="/login" />} />
                        <Route path="/login" element={this.state.authenticated ? <Navigate to="/home" /> : <Login onLoginSuccess={this.handleLoginSuccess} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:id/:token" element={<ResetPasswordWrapper />} />
                        <Route path="/dosage" element={this.state.authenticated ? <DosageCalculator /> : <Navigate to="/login" />} />
                        <Route path='/search-medicine' element={this.state.authenticated ? <Search /> : <Navigate to="/login" />} />
                        <Route path="/specialists" element={this.state.authenticated ? <Specialists /> : <Navigate to="/login" />} />
                        <Route path="/specialist/:specialistId" element={this.state.authenticated ? <SpecialistDoctors /> : <Navigate to="/login" />} />
                        <Route path="/cart" element={this.state.authenticated ? <Cart /> : <Navigate to="/login" />} />
                        <Route path="/checkout" element={this.state.authenticated ? <CheckOut /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

const Navigation = ({ authenticated, handleLogout }) => {
    const location = useLocation();
    const hiddenRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password/:id/:token'];

    return (
        <nav className="navStyle">
            {!hiddenRoutes.includes(location.pathname) && (
                <>
                    <Link to="/home" className="nav-link">
                        <button className="nav-button button-hover">
                            <img src="navbar_home.png" alt="Home" className="nav-icon" />
                            <span className="button-text">Home</span>
                        </button>
                    </Link>

                    <Link to="/account" className="nav-link">
                        <button className="nav-button button-hover">
                            <img src="navbar_account.png" alt="Account" className="nav-icon" />
                            <span className="button-text">Account</span>
                        </button>
                    </Link>

                    <Link to="/cart" className="nav-link">
                        <button className="nav-button button-hover">
                            <img src="navbar_cart.png" alt="Cart" className="nav-icon" />
                            <span className="button-text">Cart</span>
                        </button>
                    </Link>

                    <Link to="/" onClick={handleLogout} className="nav-link">
                        <button className="nav-button button-hover">
                            <img src="navbar_logout.png" alt="Logout" className="nav-icon" />
                            <span className="button-text">Logout</span>
                        </button>
                    </Link>
                </>
            )}
        </nav>
    );
};

export default App;