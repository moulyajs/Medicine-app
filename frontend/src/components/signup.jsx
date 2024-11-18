// src/signup.jsx
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/signup.css';


class SignUp extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { fullName: '', email: '', username: '', password: '', 
            confirmPassword: '', passwordTooltip: true, redirect: false, goToMain: false,};

        this.passwordRegex = /^[A-Za-z0-9_@]{8,}$/; 
    }

    componentDidMount() { document.body.classList.add('signup-body'); }

    componentWillUnmount() { document.body.classList.remove('signup-body'); }

    handleFormSubmission = (e) => {
        e.preventDefault();

        const { password, confirmPassword, fullName, email, username } = this.state;

        if (!this.passwordRegex.test(password)) 
        {
            alert('Password must be at least 8 characters long and can contain letters, numbers, underscores, and "@".');
            return;
        }

        if (password !== confirmPassword) 
        {
            alert('Passwords do not match. Please try again.');
            return;
        }

        axios.post('http://localhost:9000/signup', {fullName, email, username, password})
            .then(() => {
                alert('Sign up successful!');
                this.setState({ redirect: true });
            })
            .catch((err) => {
                if (err.response && err.response.data.message) alert(err.response.data.message);
                else 
                {
                    console.log(err);
                    alert('An error occurred. Please try again.');
                }
            } )

    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {if(name === 'password') this.handlePasswordChange(value); });
    };

    handlePasswordChange = (inputPassword) => {
        if (inputPassword.length >= 8) this.setState({ passwordTooltip: false });
        else this.setState({ passwordTooltip: true });
    };

    handleGoBack = () => { this.setState({goToMain: true, }); };

    render() 
    {
        const { fullName, email, username, password, confirmPassword, passwordTooltip, redirect, goToMain } = this.state;

        if(redirect) {return <Navigate to = "/login" />}
        if(goToMain) {return <Navigate to = "/" />}

        return (
            <div id="signuponly">
                <div className="sign-up-container">

                    <h2>Sign Up</h2>
                    <p>Create an account to get started.</p>
                    
                    <form id="sign-up-form" onSubmit={this.handleFormSubmission}>

                        <label htmlFor="full-name">Full Name: </label>
                        <input
                            type="text" id="full-name" name="fullName"
                            placeholder="Enter your full name" value={fullName}
                            onChange={this.handleInputChange} required />

                        <label htmlFor="email">Email Address: </label>
                        <input
                            type="email" id="email" name="email"
                            placeholder="Enter your email address" value={email}
                            onChange={this.handleInputChange} required disabled = {!fullName}/>

                        <label htmlFor="username">Username: </label>
                        <input
                            type="text" id="username" name="username" 
                            placeholder="Choose a username" value={username}
                            onChange={this.handleInputChange} required disabled = {!email}/>

                        <label htmlFor="password">Password: </label>
                        <div className="input-with-tooltip">
                            <input
                                type="password" id="password" name="password"
                                placeholder="Create a password" value={password}
                                onChange={this.handleInputChange} required disabled = {!username}/>
                            {passwordTooltip && (
                                <span className="tooltip">
                                    Password must be at least 8 characters long and can contain letters, numbers, underscores, and '@'.
                                </span>
                            )}
                        </div>

                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input
                            type="password" id="confirm-password" name="confirmPassword"
                            placeholder="Confirm your password" value={confirmPassword}
                            onChange={this.handleInputChange} required disabled = {!password} />

                        <input type="submit" value="Sign Up" />
                    </form>

                    <div className="back-to-login">
                        <p> Already have an account? <Link to="/login">Sign-In</Link> </p>
                    </div>

                    <div className="remember-me">
                        <button id="remember-me" name="remember-me" onClick = {this.handleGoBack}> 
                            <b>Go back to Main Page</b> 
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;