import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SpecialistDoctors.css";

const SpecialistDoctors = () => {
    const { specialistId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Fetch doctors by specialist
        const fetchDoctors = async () => {
            try {
                const response = await fetch(`http://localhost:9000/api/specialists/${specialistId}/doctors`);
                if (!response.ok) {
                    throw new Error("Failed to fetch doctors");
                }
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
      
        fetchDoctors();
    }, [specialistId]);

    const handleBookAppointment = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setModalVisible(true); // Show the modal
    };

    const handleModalClose = () => {
        setModalVisible(false); // Close the modal
        setSelectedDoctor(null); // Close the form
        setPhone(""); // Clear the phone input
    };

    if (loading) {
        return <p>Loading doctors...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="doctors-container">
            {doctors.map((doctor) => (
                <div className="doctor-card" key={doctor._id}>
                    <img src={`http://localhost:9000${doctor.image}`} alt={doctor.name} className="doctor-image" />
                    <div className="doctor-info">
                        <h3>{doctor.name}</h3>
                        <p>{doctor.qualification}</p>
                        <p>Available: {doctor.available_time}</p>
                        <p>{doctor.years_of_experience} Years of Experience</p>
                    </div>
                    <button onClick={() => handleBookAppointment(doctor)} className="book-appointment-btn">
                        Book an Appointment
                    </button>
                </div>
            ))}

            {selectedDoctor && (
                <form className="appointment-form" onSubmit={handleFormSubmit}>
                    <h3>Book an Appointment with {selectedDoctor.name}</h3>
                    <label>Enter your phone number:</label>
                    <input
                        type="text"
                        value={phone}
                        className="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">Book Now</button>
                    <button type="button" onClick={() => setSelectedDoctor(null)} className="cancel-btn">
                        Cancel
                    </button>
                </form>
            )}

            {/* Modal for confirmation */}
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Appointment Booked!</h3>
                        <p>
                            You've successfully booked an appointment with {selectedDoctor.name}.
                            You'll receive a call between {selectedDoctor.available_time}.
                        </p>
                        <button onClick={handleModalClose} className="modal-close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecialistDoctors;
