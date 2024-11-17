// src/components/MedicineSafetyChecker.js
import React, { useState, useEffect } from 'react';
import './CSS/MedicineSafetyChecker.css';

function MedicineSafetyChecker() {
    const [medicineName, setMedicineName] = useState('');
    const [age, setAge] = useState('');
    const [allergies, setAllergies] = useState('');
    const [healthConditions, setHealthConditions] = useState('');
    const [warnings, setWarnings] = useState(null);
    const [error, setError] = useState('');
    const [showMore, setShowMore] = useState(false); // New state for Show more

    useEffect(() => {
        document.body.classList.add('safetychecker-body');
        return () => { document.body.classList.remove('safetychecker-body'); };
    }, []);

    const checkSafety = async () => {
        try {
            setError('');
            setWarnings(null);

            const response = await fetch('http://localhost:9000/api/medicine-safety', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: medicineName,
                    age: parseInt(age),
                    allergies: allergies.split(',').map(a => a.trim()),
                    healthConditions: healthConditions.split(',').map(h => h.trim()),
                }),
            });

            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching data');
            }

            const data = await response.json();
            setWarnings(data.warnings);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="medicine-safety-checker">
            <h2>Medicine Safety Checker</h2>
            <input
                type="text"
                placeholder="Medicine Name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            <input
                type="text"
                placeholder="Allergies (comma-separated)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
            />
            <input
                type="text"
                placeholder="Health Conditions (comma-separated)"
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
            />
            <button onClick={checkSafety}>Check Safety</button>

            {error && <p className="error-message">{error}</p>}

            {warnings && (
                <div className="warnings">
                    <h3>Warnings</h3>
                    <p className={warnings.ageRestricted ? "highlight-warning" : ""}>
                        Age Restricted: {warnings.ageRestricted ? 'Yes' : 'No'}
                    </p>
                    <p className={warnings.allergyWarning ? "highlight-warning" : ""}>
                        Allergy Warning: {warnings.allergyWarning ? 'Yes' : 'No'}
                    </p>
                    <p className={warnings.healthConditionWarning ? "highlight-warning" : ""}>
                        Health Condition Warning: {warnings.healthConditionWarning ? 'Yes' : 'No'}
                    </p>

                    {warnings.commonSideEffects?.length > 0 && (
                        <>
                            <h4>Common Side Effects</h4>
                            <ul>
                                {warnings.commonSideEffects.map((effect, index) => (
                                    <li key={index}>{effect}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {/* Show More Button */}
                    <button onClick={() => setShowMore(!showMore)} className="show-more-button">
                        {showMore ? 'Collapse' : 'Show More'}
                    </button>

                    {/* Show More Content */}
                    {showMore && (
                        <>
                            {warnings.seriousSideEffects?.length > 0 && (
                                <>
                                    <h4>Serious Side Effects</h4>
                                    <ul>
                                        {warnings.seriousSideEffects.map((effect, index) => (
                                            <li key={index}>{effect}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {warnings.pregnancyWarning && (
                                <p className="pregnancy-warning">
                                    Pregnancy Warning: {warnings.pregnancyWarning}
                                </p>
                            )}

                            {warnings.breastfeedingWarning && (
                                <p className="breastfeeding-warning">
                                    Breastfeeding Warning: {warnings.breastfeedingWarning}
                                </p>
                            )}
                        </>
                    )}

                    {warnings.dosageInformation?.length > 0 && (
                        <>
                            <h4>Dosage Information</h4>
                            <ul>
                                {warnings.dosageInformation.map((dosage, index) => (
                                    <li key={index}>{dosage.ageRange}: {dosage.dosage}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {warnings.interactionWarnings?.length > 0 && (
                        <p className="interaction-warnings">
                            Interaction Warnings: {warnings.interactionWarnings.join(', ')}
                        </p>
                    )}

                    {warnings.storageInstructions && (
                        <p className="storage-instructions">
                            Storage Instructions: {warnings.storageInstructions}
                        </p>
                    )}

                    {(warnings.ageRestricted || warnings.allergyWarning || warnings.healthConditionWarning) && (
                        <p className="consult-message">
                            ⚠️ Please consult a healthcare professional due to potential risks.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MedicineSafetyChecker;
