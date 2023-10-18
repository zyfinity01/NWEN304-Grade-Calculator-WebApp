// Home.js
import React, { useState } from 'react';
import "./Home.css";


const Home = () => {
    const [course, setCourse] = useState('');
    const [grade, setGrade] = useState('');

    const handleGradeCalculation = () => {
        console.log('Calculating grades...');
        const data = {
            studentUsername: 'yourUsername',
            course: course,
            score: parseFloat(grade)
        };

        fetch('http://localhost:5000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };



    const handleSaveGrades = () => {
        console.log('Saving grades...');

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
                <button onClick={handleSaveGrades} className="calculateBtn">
                    Save Grades
                </button>

                <button onClick={handleGradeCalculation} className="calculateBtn">
                    Calculate Grades - test
                </button>
                

            </div>
        </div>
    );
};

export default Home;
