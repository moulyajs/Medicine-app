import React, { useEffect, useState } from "react";
import "./CSS/ProfilePage.css";
import axios from "axios";

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Fields for editing
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        // Check if the user is logged in
        const isLoggedIn = window.localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            alert("You are not logged in! Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        // Fetch user data
        axios
            .get("http://localhost:9000/api/account", { withCredentials: true })
            .then((response) => {
                setUserData(response.data);
                setFullName(response.data.fullName || "");
                setEmail(response.data.email || "");
                setUsername(response.data.username || "");
                setAge(response.data.age || "");
                setGender(response.data.gender || "");
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                console.error("Error fetching profile data:", error.response || error.message);
                alert("Failed to load profile. Redirecting to login...");
                window.location.href = "/login";
            });       
    }, []);

    useEffect(() => {
        document.body.classList.add('profilepage-body');
        return () => { document.body.classList.remove('profilepage-body'); };
    }, []);


    const handleSave = () => {
        const updatedData = { fullName, email, username, age, gender };
        axios
            .put("http://localhost:9000/api/account", updatedData, { withCredentials: true })
            .then((response) => {
                alert("Profile updated successfully!");
                // Update the state with the new data
                setUserData((prevData) => ({
                    ...prevData,
                    ...updatedData,
                }));
                setIsEditing(false); // Exit editing mode
            })
            .catch((error) => {
                console.error("Error updating profile:", error.response || error.message);
                alert("Failed to update profile. Please try again.");
            });
    };

    if (loading) {
        return <div className="loading">Loading your profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>Your Profile</h1>
                {!isEditing ? (
                    <div className="profile-info">
                        <p>
                            <strong>Full Name:</strong> {userData.fullName}
                        </p>
                        <p>
                            <strong>Email:</strong> {userData.email}
                        </p>
                        <p>
                            <strong>Username:</strong> {userData.username}
                        </p>
                        <p>
                            <strong>Gender:</strong> {userData.gender || "Not specified"}
                        </p>
                        <p>
                            <strong>Age:</strong> {userData.age || "Not specified"}
                        </p>
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="edit-profile">
                        <label>
                            Full Name:
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <label>
                            Gender:
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Not specified</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>
                            Age:
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </label>
                        <button onClick={handleSave} className="save-button">
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
