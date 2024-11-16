import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/Specialists.css"; // Add your CSS file for styling

const Specialists = () => {
    const [specialists, setSpecialists] = useState([]);

    useEffect(() => {
        document.body.classList.add('specialists-body');
        return () => { document.body.classList.remove('specialists-body'); };
    }, []);

    useEffect(() => {
        // Fetch specialists from API
        const fetchSpecialists = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/specialists");
                const data = await response.json();
                setSpecialists(data);
            } catch (error) {
                console.error("Error fetching specialists:", error);
            }
        };

        fetchSpecialists();
    }, []);

    return (
        <div className="specialists-container">
            <h1 className="header">Our Specialists</h1>
            <div className="specialists-cards">
                {specialists.map((specialist) => (
                    <div className="specialist-card" key={specialist._id}>
                        <div className="specialist-card-content">
                            <img
                                src={`http://localhost:5000${specialist.image}`}
                                alt={specialist.specialty}
                                className="specialist-card-image"
                            />
                            <h3>{specialist.specialty}</h3>
                            <p>{specialist.description}</p>
                            <ul>
                                {specialist.conditions.map((condition, index) => (
                                    <li key={index}>{condition}</li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/specialist/${specialist._id}`} className="specialist-card-link">
                            Consult a doctor
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Specialists;
