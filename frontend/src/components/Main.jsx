// src/Main.jsx
import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";
import { isAuthenticated } from '../features/auth';
import "./CSS/main.css"

class Main extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = { search: false, buy: false, /*medsubmit: false,*/ authenticated: false }
    }
    //componentDidMount() { document.body.classList.add('mainpg-body'); }
    componentWillUnmount() { document.body.classList.remove('mainpg-body'); }

    async componentDidMount() {
        document.body.classList.add('mainpg-body'); 
        const authStatus = await isAuthenticated();
        this.setState({ authenticated: authStatus });
    }

    onSearch = () => { this.setState({ search: true, }) };
    onBuy = () => { this.setState({ buy: true, }) };
    /*onMedSubmit= () => { this.setState({ medsubmit: true, }) };*/

    render() 
    {
        const { search, buy, /*medsubmit*/ } = this.state;
        if(search) return ( this.state.authenticated ? <Navigate to="/search-medicine" /> : <Navigate to="/login" /> )
        if(buy) return ( this.state.authenticated ? <Navigate to="/cart" /> : <Navigate to="/login" /> )
        //if(medsubmit) return ( this.state.authenticated ? <Navigate to="/search-medicine" /> : <Navigate to="/login" /> )

        return (
            <div className="App">
                <header className="header">
                    <div className="logo"> <img src="Logo_img.jpg" alt="Logo" /> </div>

                    <div className="nav">
                        <Link to="/signup"><button className="sign-up">Sign up</button></Link>
                        <Link to="/login"><button className="login">Login</button></Link>
                    </div>
                </header>

                <section className="hero-section">
                    <div className="hero-text">
                        <h1>Dr.PillPilot - Your Trusted Medicine Companion</h1>
                        <p>
                            Find comprehensive information on medicines, calculate dosages, get
                            personalized recommendations, and consult with healthcare
                            professionals.
                        </p>

                        <div className="hero-buttons">
                            <button className="search-button" onClick={this.onSearch}>Search Medicines</button>
                            <button className="buy-button"onClick={this.onBuy}>Buy Medicine Online</button>
                        </div>
                    </div>
                    <div className="hero-image"><img src="Mainpg_img.jpg" alt="Main" /></div>
                </section>

                <section className="description-section">
                    <h2>Dr.PillPilot</h2>
                    <p>
                        An Online Medicine Information and Management System designed to provide users with comprehensive 
                        information on medicines. It features a search tool for finding medicines, dosage calculation based 
                        on user inputs, personalized medicine recommendations, safety checks, and an integrated consultation 
                        option with healthcare professionals. Additionally, the platform supports online medicine purchasing 
                        and offers an FAQ section.
                    </p>
                </section>

                {/*<section className="search-tool-section">
                    <h3>Comprehensive Medicine Information</h3>
                    <h2>Search Tool for Medicines</h2>
                    <p>
                        Find detailed information on medicines using our search tool. Simply
                        enter the name of the medicine and get access to its uses, dosage, side
                        effects, and more.
                    </p>
                    <form className="search-form">
                        <label>Full Name</label>
                        <input type="text" placeholder="Your name" required/>

                        <label>Email Address</label>
                        <input type="email" placeholder="Your email" required/>

                        <label>Message</label>
                        <input placeholder="Enter the medicine name"></input>

                        <button type="submit" onSubmit={doSubmit}>Submit</button>
                    </form>
                </section>*/}

                <footer className="footer">
                    <h4 style = {{textAlign: "center"}}> Dr.PillPilot </h4>
                    <div className="footer-links">
                        <div className="link-column">
                            <ul>
                                <li>Medicine Information</li>
                                <li>Dosage Calculation</li>
                                <li>Safety Checks</li>
                            </ul>
                        </div>
                        <div className="link-column">
                            <ul>
                                <li>Account</li>
                                <li>FAQ</li>
                                <li>Consultation</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2023 Company. All rights reserved.</p>
                        <p>privacy policy | terms of service | cookie settings</p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Main;