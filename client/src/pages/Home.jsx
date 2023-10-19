import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [targetGrade, setTargetGrade] = useState('');

  // Fetch user on component mount
  useEffect(() => {
    fetch('${process.env.REACT_APP_BACKEND_API_URL}currentUser', {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUser(data.username);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  }, []);

  const handleAddCourse = () => {
    const data = {
      studentUsername: currentUser,
      course: {
        courseName: courseName,
        assignments: assignments,
      },
    };

    fetch('${process.env.REACT_APP_BACKEND_API_URL}saveCourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Clear modal content and fetch updated courses
        setCourseName('');
        setAssignments([]);
        setShowModal(false);
        fetchCourses();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const fetchCourses = () => {
    // Fetch courses for the user and update the `courses` state.
    // Placeholder functionality.
  };

  const addAssignment = () => {
    setAssignments([...assignments, { name: '', weight: 0, score: 0 }]);
  };

  const handleAssignmentChange = (index, field, value) => {
    const newAssignments = [...assignments];
    newAssignments[index][field] = value;
    setAssignments(newAssignments);
  };

  return (
    <div className="homeContainer">
      <h1>Welcome to the VUW Grade Calculator</h1>

      <button onClick={() => setShowModal(true)}>Add New Course</button>

      {showModal && (
        <div className="modal">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
          />

          {assignments.map((assignment, index) => (
            <div key={index}>
              <input
                value={assignment.name}
                onChange={(e) => handleAssignmentChange(index, 'name', e.target.value)}
                placeholder="Assignment Name"
              />
              <input
                type="number"
                value={assignment.weight}
                onChange={(e) => handleAssignmentChange(index, 'weight', +e.target.value)}
                placeholder="Weight"
              />
              <input
                type="number"
                value={assignment.score}
                onChange={(e) => handleAssignmentChange(index, 'score', +e.target.value)}
                placeholder="Score"
              />
            </div>
          ))}

          <button onClick={addAssignment}>Add Assignment/Exam</button>
          <button onClick={handleAddCourse}>Save Course</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

      <div className="coursesDisplay">
        {/* Display courses, average grades, and target grades */}
        {courses.map((course) => (
          <div key={course.id}>
            <h2>{course.courseName}</h2>
            {/* Display average grade and target grade logic here */}
          </div>
        ))}
      </div>

      <div className="targetGradeUI">
        <input
          type="number"
          value={targetGrade}
          onChange={(e) => setTargetGrade(e.target.value)}
          placeholder="Desired Average"
        />
        {/* <button onClick={Fetch or calculate target grade logic here}>Calculate</button> */}
      </div>
    </div>
  );
};

export default Home;
