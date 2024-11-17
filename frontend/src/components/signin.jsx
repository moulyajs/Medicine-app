// src/signin.jsx
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/signin.css';

class Login extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { username: '', password: '', redirect: false, goToMain: false, };

        this.validUsers = [
            { username: 'testuser', password: 'password123' },
            { username: 'anotheruser', password: 'anotherpassword' }, ];
    }

    componentDidMount() { document.body.classList.add('signin-body'); }

    componentWillUnmount() { document.body.classList.remove('signin-body'); }

    validateLogin = (username, password) => {
        return this.validUsers.some(user => user.username === username && user.password === password);
    };

    handleFormSubmission = (e) => {
        e.preventDefault();

        const { username, password, } = this.state;

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:9000/login', {username, password})
            .then((result) => {
                console.log("Server response: ", result.data);
                if(result.data === "Success")
                {
                    window.localStorage.setItem("isLoggedIn", true);
                    alert('Sign In successful!');
                    this.props.onLoginSuccess();
                    this.setState({ redirect: true });
                }
                if(result.data === "Password Failure" || result.data === "Incorrect Password!!") alert('Incorrect Password....Please try again');
                if(result.data === "Username Failure") alert("Incorrect Username or Email....Please try again");

            })
            .catch((err) => {console.log(err);} )
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleGoBack = () => { this.setState({goToMain: true, }); };
    
    render() 
    {
        const { username, password, redirect, goToMain } = this.state;

        if(redirect) {console.log("Redirecting to dosage!!"); return <Navigate to = "/home" />}
        if(goToMain) {return <Navigate to = "/" />}

        return (
            <div className="login-container">
                <div className="login-form-container">

                    <h2> Login </h2>
                    <p> Enter credentials to access your account. </p>

                    <form id="login-form" onSubmit={this.handleFormSubmission}>

                        <div className="form-group">
                            <label htmlFor="username">Username/Email:</label> 
                            <input
                                type="text" id="username" name="username"
                                placeholder="Enter your email address/ username" value={username}
                                onChange={this.handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password" id="password" name="password"
                                placeholder="Enter your password" value={password}
                                onChange={this.handleInputChange} required />
                        </div>
                        
                        <input type="submit" value="Login" />
                    </form>

                    <div className="container">
                        <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
                    </div>

                    <div className="alternative-login">
                        <p> Don't have an account? <Link to="/signup">Sign up</Link> </p>
                    </div>

                    <div className="remember-me">
                        <button id="remember-me" name="remember-me" onClick = {this.handleGoBack}> 
                            <b>Go back to Main Page</b> 
                        </button>
                    </div>

                </div>

                <div className="image-container">
                    <img src="signin_img.jpg" alt="Login illustration" />
                </div>
            </div>
        );
    }
}

export default Login;