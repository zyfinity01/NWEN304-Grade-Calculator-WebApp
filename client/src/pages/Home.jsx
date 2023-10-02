// Home.js
import React, { useState } from 'react';
import "./Home.css";
//import "../CalcLogic.js";

// ... Your existing imports ...

const Home = () => {
    const [course, setCourse] = useState('');
    const [grade, setGrade] = useState('');

    const handleGradeCalculation = () => {
        console.log('Calculating grades...');
    };

    return (
        <div className="homeContainer">
            <h1>Welcome to the VUW Grade Calculator</h1>

            <div className="gradeCalculationUI">
                <div className="courseAndButton">
                    <input
                        type="text"
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                        placeholder="Enter Course"
                        className="courseInput"
                    />
                    
                </div>
                <input
                    type="text"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    placeholder="Enter Grade"
                    className="gradeInput"
                />
                <button onClick={handleGradeCalculation} className="calculateBtn">
                    Calculate Grades - test
                </button>

            </div>
        </div>
    );
};

export default Home;
