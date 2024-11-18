// src/dosage.jsx
import React, { Component } from 'react';
import axios from 'axios';
import './CSS/dosage.css';

class DosageCalculator extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { medications: [], selectedMed: '', selectedDisease: '', age: '', loading: true, error: null };
    }

    componentDidMount() 
    {
        //axios.defaults.withCredentials = true;
        document.body.classList.add('dose-body');
        axios.get('http://localhost:9000/api/medications')
            .then(response => { this.setState({ medications: response.data.medicines, loading: false }); })
            .catch(() => { this.setState({ error: "Unable to fetch dosage data. Please try again later.", loading: false }); });

    }
    componentWillUnmount() { document.body.classList.remove('dose-body'); }
    handleMedChange = (e) => { this.setState({ selectedMed: e.target.value, selectedDisease: '', age: '' }); };
    handleDiseaseChange = (e) => { this.setState({ selectedDisease: e.target.value }); };
    handleAgeChange = (e) => { this.setState({ age: e.target.value, selectedDisease: '' }); };

    render() 
    {
        const { medications, selectedMed, selectedDisease, age, loading, error } = this.state;
        const selectedMedication = medications.find(med => med.name === selectedMed);
        const isAdult = age >= 18;
        const condition = (selectedMed === "Digoxin" || selectedMed === "Theophylline" || selectedMed === "Carbamazepine" || selectedMed === "Flecainide" || selectedMed === "Levothyroxine");

        if (loading) return <p>Loading data...</p>;
        if (error) return <p>{error}</p>;

        return (
            <div className='dose-container'>
                <label className="dose-label">Select Medication:  </label>
                <select className="dose-select" onChange={this.handleMedChange} value={selectedMed}>
                    <option value="" disabled>--Select the Medication--</option>
                    {medications.map(med => ( <option key={med.name} value={med.name}>{med.name}</option> ))}
                </select>
                
                {selectedMed && (
                    <div>
                        <label className="dose-label">Age: </label>
                        <input className="dose-select" type="number" value={age} onChange={this.handleAgeChange} placeholder="Enter your age" min={0} />
                    </div>
                )}

                {selectedMedication && age && !(age < 18 && condition) && (
                    <>
                        {age < 18 && selectedMedication.Pediatric && Object.keys(selectedMedication.Pediatric).length > 0 && (
                            <>
                                <label className="dose-label">Select Disease:</label>
                                <select className="dose-select" onChange={this.handleDiseaseChange} value={selectedDisease}>
                                    <option value="" disabled>--Select the Disease--</option>
                                    {Object.keys(selectedMedication.Pediatric).map(disease => ( <option key={disease} value={disease}>{disease}</option> ))}
                                </select>
                            </>
                        )}

                        {age >= 18 && selectedMedication.Adult && (
                            <>
                                <label className="dose-label">Select Disease:</label>
                                <select className="dose-select" onChange={this.handleDiseaseChange} value={selectedDisease}>
                                    <option value="" disabled>--Select the Disease--</option>
                                    {Object.keys(selectedMedication.Adult).map(disease => ( <option key={disease} value={disease}>{disease}</option> ))}
                                </select>
                            </>
                        )}
                    </>
                )}

                {age < 18 && selectedMedication && !selectedMedication.Pediatric && (
                    <p style={{ color: 'red' }}>Cannot provide medication for patients under 18.</p>
                )}

                {selectedDisease && selectedMedication && (isAdult ? selectedMedication.Adult[selectedDisease] : selectedMedication.Pediatric[selectedDisease]) && (
                    <p><b>{selectedDisease}:</b> {(isAdult ? selectedMedication.Adult[selectedDisease] : selectedMedication.Pediatric[selectedDisease])}</p>
                )}

                {selectedMed === "Theophylline" && age >= '0' && age < 18 && (
                    <>
                        {age && <p><b>Initially:</b>{(selectedMedication.Pediatric["Basic statement"])}</p>}
                        {age >= '0' && age <= '1' && 
                        <>
                          <p><b>1.5months - 6months: </b> {(selectedMedication.Pediatric["1.5-6 months"])}</p>
                          <p><b>6months - 12months: </b>{(selectedMedication.Pediatric["6-12 months"])}</p>
                        </>
                        }
                        {age > 1 && age <= 9 && <p>{(selectedMedication.Pediatric["1-9 years"])}</p>}
                        {age > 9 && age <= 12 && <p>{(selectedMedication.Pediatric["9-12 years"])}</p>}
                        {age > 12 && age < 18 && <p>{(selectedMedication.Pediatric["12-18 years"])}</p>}
                    </>
                )}
                
                {selectedMed === "Digoxin" && age >= '0' && age < 18 && (
                    <>
                        {age === '0' && (
                            <div>
                                <p><b>IV for Premature neonate:</b> {selectedMedication.Pediatric["Premature neonate"]["IV"]}</p>
                                <p><b>PO for Premature neonate:</b> {selectedMedication.Pediatric["Premature neonate"]["PO"]}</p><br/>
                                <p><b>IV for Full-term neonate:</b> {selectedMedication.Pediatric["Full-term neonate"]["IV"]}</p>
                                <p><b>PO for Full-term neonate:</b> {selectedMedication.Pediatric["Full-term neonate"]["PO"]}</p><br/>
                                <p><b>IV for 1 month - 12 months:</b> {selectedMedication.Pediatric["0-2 years"]["IV"]}</p>
                                <p><b>PO for 1 month - 12 months:</b> {selectedMedication.Pediatric["0-2 years"]["PO"]}</p><br/>
                            </div>
                        )}
                        {age >= 1 && age < 2 && (
                            <>
                              <p><b>IV:</b> {selectedMedication.Pediatric["0-2 years"]["IV"]}</p>
                              <p><b>PO:</b> {selectedMedication.Pediatric["0-2 years"]["PO"]}</p>
                            </>
                        )}
                        {age >= 2 && age < 5 && (
                            <>
                              <p><b>IV:</b> {selectedMedication.Pediatric["2-5 years"]["IV"]}</p>
                              <p><b>PO:</b> {selectedMedication.Pediatric["2-5 years"]["PO"]}</p>
                            </>
                        )}
                        {age >= 5 && age < 10 && (
                            <>
                              <p><b>IV:</b> {selectedMedication.Pediatric["5-10 years"]["IV"]}</p>
                              <p><b>PO:</b> {selectedMedication.Pediatric["5-10 years"]["PO"]}</p>
                            </>
                        )}
                        {age >= 10 && age < 18 && (
                            <>
                              <p><b>IV:</b> {selectedMedication.Pediatric["10-18 years"]["IV"]}</p>
                              <p><b>PO:</b> {selectedMedication.Pediatric["10-18 years"]["PO"]}</p>
                            </>
                        )}
                    </>
                )}

                {selectedMed === "Carbamazepine" && age >= '0' && age < 18 && (
                    <>
                        {age >= '0' && age < 6 && <p>{(selectedMedication.Pediatric["Less than 6 years"])}</p>}
                        {age >= 6 && age < 12 && <p>{(selectedMedication.Pediatric["6-12 years"])}</p>}
                        {age >= 12 && age < 18 && <p>{(selectedMedication.Pediatric["12-18 years"])}</p>}
                    </>
                )}      

                {selectedMed === "Flecainide" && age >= '0' && age < 18 && (
                    <>
                        <h4> This medicine is given for Arrythmias </h4>
                        {<p><b>For less than 6 months old: </b>{(selectedMedication.Pediatric["Less than 6 months"])}</p>}
                        {<p>6 months - 18 years old: {(selectedMedication.Pediatric["12-18 years"])}</p>}
                    </>
                )} 

                {selectedMed === "Levothyroxine" && age >= '0' && age < 18 && (
                    <>
                        <h4> This medicine is given for Hypothyroidism </h4>
                        {age === '0' && (
                            <>
                                <p><b>0-3 months: </b> {selectedMedication.Pediatric["0-3 months"]}</p>
                                <p><b>3-6 months: </b> {selectedMedication.Pediatric["3-6 months"]}</p>
                                <p><b>6-12 months: </b> {selectedMedication.Pediatric["6-12 months"]}</p>
                            </>
                        )}
                        {age >= 1 && age < 6 && <p>{(selectedMedication.Pediatric["1-5 years"])}</p>}
                        {age >= 6 && age < 12 && <p>{(selectedMedication.Pediatric["6-12 years"])}</p>}
                        {age >= 12 && age < 18 && <p>{(selectedMedication.Pediatric["12-18 years"])}</p>}
                    </>
                )} 

                {selectedMedication && selectedMedication.category === "Anti-cancer" && age >=18 &&
                    (!selectedMedication.Adult && !selectedMedication.Pediatric) && (
                    <CancerCalculator />
                )}
            </div>
        );
    }
}

class CancerCalculator extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { height: '', weight: '', bsa: null, dose: null, message: null };
    }

    componentDidMount() { document.body.classList.add('dosecancer-body'); }

    componentWillUnmount() { document.body.classList.remove('dosecancer-body'); }

    calculateBSA = (height, weight) => { return 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725); };

    calculateDose = () => {
        const { height, weight } = this.state;
        if (height && weight) 
        {
            const calculatedBsa = this.calculateBSA(height, weight);
            const calculatedDose = Math.pow(calculatedBsa, 2);
            this.setState({ bsa: (calculatedBsa * 1000).toFixed(2), dose: calculatedDose.toFixed(2), message: null });
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { height, weight, bsa, dose, message } = this.state;

        return (
            <div className="cancer-calculator">
                <h3 className="cancer-heading">Enter the required data</h3>

                <div className="cancer-input-group">
                    <label>Height :  </label>
                    <input type="number" className="dose-input" name="height" value={height} onChange={this.handleInputChange} placeholder="Enter your height" min = {54} max = {272} required/>
                    <p style = {{marginLeft: "7px", display:"inline-block"}}> cm </p>
                </div>

                <div className="cancer-input-group">
                    <label>Weight :  </label>
                    <input type="number" className="dose-input" name="weight" value={weight} onChange={this.handleInputChange} placeholder="Enter your weight" min = {3} max = {635} required/>
                    <p style = {{marginLeft: "7px", display:"inline-block"}}> kg </p>
                </div>

                {height && weight && ( <button className="dose-button" onClick={this.calculateDose}>Calculate Dose</button>)}

                {message && <p className="dose-message">{message}</p>}

                {bsa && dose && (
                    <div className="cancer-result">
                        <p><b>Your Dose:</b> {dose} mg/m²</p>
                    </div>
                )}
            </div>
        );
    }
}

export default DosageCalculator;
