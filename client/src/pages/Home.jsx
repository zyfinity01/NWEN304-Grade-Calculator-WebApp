import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {

  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [assignments, setAssignments] = useState([]);

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
          studentId: data._id
        });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  }, []);

  const fetchCourses = () => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}getAllCourses`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then(async (fetchedCourses) => {
        const coursesWithAssignmentsAndAverage = await Promise.all(
          fetchedCourses.map(async (course) => {
            // Fetch assignments
            const assignmentsResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_API_URL}getAssignments/${course.courseName}`,
              {
                credentials: 'include',
              }
            );
            const assignments = await assignmentsResponse.json();
  
            // Fetch average grade using your backend endpoint
            const averageGradeResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_API_URL}averageGrade/${course.courseName}`,
              {
                credentials: 'include',
              }
            );
            const { averageGrade } = await averageGradeResponse.json();
  
            return {
              ...course,
              assignments,
              average: averageGrade,
            };
          })
        );
  
        setCourses(coursesWithAssignmentsAndAverage);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
  };
  
  

  const addCourse = (courseName) => {
    const courseData = {
      courseName: courseName,
      pointValue: 15
    };

    return fetch(`${process.env.REACT_APP_BACKEND_API_URL}addCourse`, {
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
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addAssignments = (courseName, assignments) => {
    assignments.forEach(assignment => {
      const assignmentData = {
        courseName: courseName,
        name: assignment.name,
        weight: assignment.weight,
        grade: assignment.score / 100
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
          console.log(data.message);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  };

  const handleAddCourse = () => {
    addCourse(courseName)
      .then(() => {
        addAssignments(courseName, assignments);
        setCourseName('');
        setShowModal(false);
        fetchCourses();
      });
  };


  const deleteCourse = async (courseName) => {
    try {
      // Deleting assignments for the course
      await fetch(`${process.env.REACT_APP_BACKEND_API_URL}deleteAssignments/${courseName}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // Deleting the course itself
      await fetch(`${process.env.REACT_APP_BACKEND_API_URL}deleteCourse/${courseName}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // Refetch courses to update UI
      fetchCourses();
    } catch (error) {
      console.error('Error:', error);
    }
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
            <h2>{course.courseName}</h2>
            <button onClick={() => deleteCourse(course.courseName)}>Delete Course</button> 
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
        <h3>Grade Calculation Results</h3>
      </div>
      <button className="fetchCourseBtn" onClick={fetchCourses}>Fetch Courses</button>
    </div>
  );
};

export default Home;
