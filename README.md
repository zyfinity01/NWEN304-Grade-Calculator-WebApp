# VUW Grade Calculator Readme 

### Introduction

This is a simple grade calculator to get an average of your assignments and a total grade for each course.

### URL

The grade calculator is hosted on a VPS and is accessible at [https://gradecalc.live](https://gradecalc.live).

The backend API is also hosted on the same VPS and is accessible at [https://api.gradecalc.live](https://api.gradecalc.live).

### Fault Tolerance/Error Handling

The grade calculator frontend is fault-tolerant and will not crash if the user enters invalid input. The user will be notified of the error and will be able to correct it.

The server will attempt to restart automatically in the event of a crash.

### Frontend Test Cases

* Sign In Flow
    * Sign in with valid credentials
    * Sign in with invalid credentials
    * Sign in with empty credentials
* Sign Up Flow
    * Sign up with valid credentials
    * Sign up with empty credentials
* Course Flow
    * Add a course
    * Add a course with invalid input
    * Add a course with empty input
    * Delete a course
* Assignment Flow
    * Add an assignment
    * Add an assignment with invalid input
    * Add an assignment with empty input
    * Edit an assignment
    * Edit an assignment with invalid input
    * Delete an assignment
* Grade Flow
    * Ensure grade is calculated correctly

### Backend Test Scripts

# Set the JWT value
export JWT_TOKEN="your_jwt_token_here"

# /calculate
curl -X POST -H "Content-Type: application/json" -d '{"data":"value"}' http://localhost:5000/calculate

# /addCourse
curl -X POST -H "Content-Type: application/json" -H "Cookie: jwt=$JWT_TOKEN" -d '{"courseName":"courseName","pointValue":"pointValue", "studentId":"studentId"}' http://localhost:5000/addCourse

# /deleteCourse/:courseName
curl -X DELETE -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/deleteCourse/courseName

# /addAssignment
curl -X POST -H "Content-Type: application/json" -H "Cookie: jwt=$JWT_TOKEN" -d '{"courseName":"courseName","name":"assignmentName","weight":0.5,"grade":0.9}' http://localhost:5000/addAssignment

# /getStudent
curl -X GET -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/getStudent

# /getAllCourses
curl -X GET -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/getAllCourses

# /averageGrade/:courseName
curl -X GET -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/averageGrade/courseName

# /getAssignments/:courseName/
curl -X GET -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/getAssignments/courseName

# /currentUser
curl -X GET -H "Cookie: jwt=$JWT_TOKEN" http://localhost:5000/currentUser

### Cache Headers/Test Results

We did not implement any cache headers. 

### Database Design

We use MongoDB as our database, hosted externally on MongoDB Atlas. We use 3 collections: `students`, `courses`, and `assignments`. The `students` collection stores the student's name, credentials, and the courses and assignments connected to them. The `courses` collection stores the student's courses, and the `assignments` collection stores the student's assignments as well as each one's grade and weighting, which are connected to a course via an ID relation. Each course and assignment is directly connected to a single student via their unique ID.


### Exposed API List

POST /addCourse

Purpose: Add or update a course to the database.
Middleware: jwtMiddleware (checks and verifies JWT token)

POST /addStudent

Purpose: Add a student to the database.
Middleware: jwtMiddleware

DELETE /deleteCourse/:courseName

Purpose: Delete a course using its name.
Middleware: jwtMiddleware

DELETE /deleteAssignments/:courseName

Purpose: Delete assignments associated with a particular course.
Middleware: jwtMiddleware

POST /addAssignment

Purpose: Add or update an assignment for a student in a course.
Middleware: jwtMiddleware

GET /getStudent

Purpose: Retrieve details of the currently authenticated student.
Middleware: jwtMiddleware

GET /getAllCourses

Purpose: Retrieve all courses associated with the authenticated student.
Middleware: jwtMiddleware

GET /averageGrade/:courseName

Purpose: Calculate the average grade for a student in a particular course.
Middleware: jwtMiddleware

GET /getAssignments/:courseName/

Purpose: Retrieve assignments for the authenticated student in a given course.
Middleware: jwtMiddleware

GET /currentUser

Purpose: Get details of the currently authenticated user.
Middleware: jwtMiddleware
