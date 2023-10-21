import React, { useState, useEffect } from 'react';
import './Home.css';
// import Slider from "react-slick"; // Import the Slider component


const Home = () => {

    const mockCourses = [
        {
          name: 'Math 101',
          assignments: [
            {name: 'Assignment 1', grade: 80, weight: 10},
            {name: 'Exam 1', grade: 90, weight: 40},
          ],
          average: 85,
        },
        {
          name: 'Physics 202',
          assignments: [
            {name: 'Lab 1', grade: 75, weight: 15},
            {name: 'Midterm Exam', grade: 88, weight: 30},
          ],
          average: 81,
        },
        // ... You can add more mock course data here ...
      ];

  const [courses, setCourses] = useState(mockCourses); // Initialize with mock data
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [targetGrade, setTargetGrade] = useState('');
  const [desiredGrade, setDesiredGrade] = useState(''); // Global desired grade for demo, could be array for per-course setting





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
        setCurrentUser(data.username);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  }, []);

  const fetchCourses = () => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}courses`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  }

  const calculateNeededGrade = (average, desired) => {
    // Logic to calculate needed grade based on the current average and desired grade
    return desired - average; // Placeholder logic
};

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

  const handleAddCourse = () => {
    const data = {
      studentUsername: currentUser,
      course: {
        courseName: courseName,
        assignments: assignments,
      },
    };

    fetch(`${process.env.REACT_APP_BACKEND_API_URL}saveCourse`, {
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

      {/* <div className="carouselContainer">
                <Slider {...settings}>
                    {courses.map((course, index) => (
                        <div key={index} className="courseCard">
                            <h2>{course.name}</h2>
                            {course.assignments.map((assignment, i) => (
                                <div key={i}>
                                    <p>{assignment.name}: {assignment.grade}% (Weight: {assignment.weight}%)</p>
                                </div>
                            ))}
                            <h3>Average: {course.average}%</h3>
                            <input
                                type="number"
                                placeholder="Desired Average"
                                value={desiredGrade}
                                onChange={e => setDesiredGrade(e.target.value)}
                            />
                            <p>You need {calculateNeededGrade(course.average, desiredGrade)}% more to reach your desired grade.</p>
                        </div>
                    ))}
                </Slider>
            </div> */}



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
        <button className="fetchCourseBtn" onClick={fetchCourses}>Fetch Courses</button>
      </div>
    </div>
  );
};

export default Home;
