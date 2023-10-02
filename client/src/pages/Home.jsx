// Home.js
import React, { useState } from 'react';
import "./Home.css";

const Home = () => {
    const [course, setCourse] = useState(''); // State to manage course input

    const handleGradeCalculation = () => {
        // Logic to calculate grades
        console.log('Calculating grades...');
        CalcLogic();
    };

    return (
        <div className="homeContainer">
            <h1>Welcome to the Grade Calculator</h1>

            {/* UI for grade calculation */}
            <div className="gradeCalculationUI">
                <input
                    type="text"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    placeholder="Enter Course"
                    className="courseInput"
                />
                <button onClick={handleGradeCalculation} className="calculateBtn">
                    Calculate Grades
                </button>
            </div>
        </div>
    );
};

export default Home;
