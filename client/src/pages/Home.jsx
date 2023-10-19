// Home.js
import React, { useState, useEffect } from 'react';

import "./Home.css";


const Home = () => {
    const [course, setCourse] = useState('');
    const [grade, setGrade] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch the current user data once the component is mounted
        fetch('http://localhost:5000/currentUser', {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCurrentUser(data.username);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });

    }, []);

    const handleGradeCalculation = () => {
        console.log('Calculating grades...');
        const data = {
            studentUsername: currentUser,
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

        if (!currentUser) {
            console.error('No user logged in.');
            return;
        }

        console.log('Saving grades...');


        const data = {
            studentUsername: currentUser,
            course: {
                courseName: course,
                grade: parseFloat(grade)
            }
        };

        fetch('http://localhost:5000/saveGrade', {
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
