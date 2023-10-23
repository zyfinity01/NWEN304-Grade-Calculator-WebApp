import React, { useState, useEffect } from 'react';
import './Home.css';
// import Slider from "react-slick"; // Import the Slider component


const Home = () => {

  const mockCourses = [
    {
      name: 'Math 101',
      assignments: [
        { name: 'Assignment 1', grade: 80, weight: 10 },
        { name: 'Exam 1', grade: 90, weight: 40 },
      ],
      average: 85,
    },
    {
      name: 'Physics 202',
      assignments: [
        { name: 'Lab 1', grade: 75, weight: 15 },
        { name: 'Midterm Exam', grade: 88, weight: 30 },
      ],
      average: 81,
    },
    // ... add more mock course data here ...
  ];

  const [courses, setCourses] = useState(mockCourses); // Initialize with mock data
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [assignments, setAssignments] = useState([]);
  //const [targetGrade, setTargetGrade] = useState('');



  // Fetch user on component mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}currentUser`, {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUser({
          username: data.username,
          studentId: data._id // assuming the backend sends the _id as "_id"
        });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  },
  []);

  const fetchCourses = () => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}getAllCourses`)
      .then((response) => response.json())
      .then((fetchedCourses) => {
        setCourses(prevCourses => [...prevCourses, ...fetchedCourses]); // merging previous courses with the fetched ones
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  };



  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const handleAddCourse = () => {
    const courseData = {
      courseName: courseName,
      pointValue: 15
    };

    fetch(`${process.env.REACT_APP_BACKEND_API_URL}addCourse`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Clear modal content and fetch updated courses
        setCourseName('');
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    assignments.forEach(assignment => {
      const assignmentData = {
        courseName: courseName, // referencing the course name for each assignment
        name: assignment.name,
        weight: assignment.weight,
        grade: assignment.score / 100 // assuming your front end takes a score out of 100, but the backend expects a grade between 0 and 1
      };

      fetch(`${process.env.REACT_APP_BACKEND_API_URL}addAssignment`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message); // log the response from the server for adding the assignment
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
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

      <button className="addCourseBtn" onClick={() => setShowModal(true)}>Add New Course</button>

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
        {courses.map((course, index) => (
          <div key={index} className="courseCard">
            <h2>{course.name}</h2>
            <ul>
              {course.assignments.map((assignment, aIndex) => (
                <li key={aIndex}>
                  {assignment.name}: {assignment.grade} (Weight: {assignment.weight}%)
                </li>
              ))}
            </ul>
            <p>Average Grade: {course.average}%</p>
          </div>
        ))}
      </div>
      <div className="resultsBox">
        {/* This is the new results box on the right-hand side */}
        <h3>Grade Calculation Results</h3>
        {}
      </div>
      <button className="fetchCourseBtn" onClick={fetchCourses}>Fetch Courses</button>

    </div>
  );
};

export default Home;