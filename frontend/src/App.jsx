// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, matchPath } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import axios from 'axios';
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
import FAQ from "./components/FAQ";
import MedicineSafetyChecker from "./components/MedicineSafetyChecker";
import ProfilePage from "./components/ProfilePage";
import "./App.css"

class App extends Component 
{
    state = { authenticated: false, username: null, };

    fetchUsername = async () => {
        try 
        {
            const response = await axios.get("http://localhost:9000/api/account", { withCredentials: true, });
            this.setState({ user: response.data.username }); 
        } catch (error) { console.error("Error fetching user data:", error.response || error.message); }
    }

    async componentDidMount() {
        const authStatus = await isAuthenticated();
        this.setState({ authenticated: authStatus });
        if(authStatus) this.fetchUsername();
    }

    handleLogout = async () => {
        const loggedOut = await logout();
        if (loggedOut) 
        {
            this.setState({ authenticated: false, username: null });
            window.localStorage.removeItem("isLoggedIn");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert("Thank you for visiting Dr.PillPilot...");
        } else { alert('Logout failed. Please try again.'); }
    };

    handleLoginSuccess = () => { this.setState({ authenticated: true }); this.fetchUsername(); };

    render() 
    {
        return (
            <Router>
                <div>
                    <ToastContainer />
                    <Navigation
                        authenticated={this.state.authenticated}
                        handleLogout={this.handleLogout}
                        username={this.state.user}
                    />
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/home" element={this.state.authenticated ? <HomePage /> : <Navigate to="/login" />} />
                        <Route path="/account" element={this.state.authenticated ? <ProfilePage /> : <Navigate to="/login" />} />
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
                        <Route path="/safety-checker" element={this.state.authenticated ? <MedicineSafetyChecker /> : <Navigate to="/login" />} />
                        <Route path="/faq" element={this.state.authenticated ? <FAQ /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

const Navigation = ({ authenticated, handleLogout, username }) => {
    const location = useLocation();
    const hiddenRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password/:id/:token'];

    const isHiddenRoute = hiddenRoutes.some((route) => 
        matchPath({ path: route, exact: true }, location.pathname)
    );

    return (
        <nav className="navStyle">
            {!isHiddenRoute && (
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
                            <span className="button-text"> {username || "Account"} </span>
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