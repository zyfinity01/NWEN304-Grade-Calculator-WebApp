require('dotenv').config()
const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const db = require("./db.js");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to the database when the server starts
db.connect().then(() => {
  app.listen("5000", () => {
      console.log("Server is running and connected to the database!");
  });
}).catch(err => {
  console.error("Failed to connect to the database:", err);
});

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.BACKEND_API_URL],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


function jwtMiddleware(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (ex) {
      res.status(400).send('Invalid token.');
  }
}

app.post('/calculate', async (req, res) => {
  console.log(req.body);
  //const { studentUsername, course, score } = req.body;
  // if (!studentUsername || !course || !score) {
  //   return res.status(400).json({ message: 'Missing required fields' });
  // }

  //await CalcLogic.handleGradeCalculation(studentUsername, course, score);
  res.json({ message: 'Grade calculated!' });
});

app.post('/addCourse', jwtMiddleware, async (req, res) => {
  console.log("Save course");

  const course = {
    courseName: req.body.courseName,
    pointValue: req.body.pointValue
  };

  try {
    const existingCourse = await db.getCourse(req.body.courseId);

    if (existingCourse) {
      await db.updateCourse(req.body.courseId, course);
      res.status(200).json({ message: "Course updated successfully!" });
    } else {
      const newCourseId = await db.putCourse(req.user.mongoid, course);
      //await db.addCourseToStudent(req.user.mongoid, newCourseId);
      res.status(200).json({ message: "Course added successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to save course", error: error.message });
  }
});




app.post('/addStudent', jwtMiddleware, async (req, res) => {

  const student = {
    name: req.body.name,
    email: req.body.email,
    oauthId: req.user.id // assuming this comes from OAuth login
  };

  try {
    const success = await db.putStudent(student);

    if (success) {
      res.status(200).json({ message: "Student added successfully!" });
    } else {
      res.status(500).json({ message: "Failed to add student" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }

});


app.delete('/deleteCourse/:courseId', jwtMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate required params
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const result = await db.deleteCourse(courseId);
    if (result) {
      res.status(200).json({ message: "Course deleted successfully!" });
    } else {
      res.status(500).json({ message: "Failed to delete course" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting course', details: error.message });
  }
});



app.post('/addAssignment', jwtMiddleware, async (req, res) => {

  courseName = req.body.courseName;
  const courseId = await db.getCourseIdByCourseName(courseName);
    

  const assignment = {
    courseId: courseId,
    studentId: req.user.mongoid,
    name: req.body.name,
    weight: req.body.weight,
    grade: req.body.grade
  };

  try {

    const existing = await db.getAssignment(assignment.studentId, assignment.courseId, assignment.name);

    if (existing) {
      const updated = await db.updateAssignment(existing._id, assignment);
      if(updated) {
        res.status(200).json({message: "Assignment updated successfully!"});
      } else {
        res.status(500).json({message: "Failed to update assignment"});
      }
    } else {
      const newId = await db.putAssignment(assignment);
      res.status(201).json({message: "Assignment added successfully!"});
    }

  } catch (error) {
    res.status(500).json({message: "Error adding assignment", error});
  }

});


////////////////////////////////////

// REDUNDANT WITH ADD ASSIGNMENT ENDPOINT

//////////////////////////////////////
// app.post('/addGrade', jwtMiddleware, async (req, res) => {

//   const studentId = req.user.mongoid; // get from JWT
//   const courseName = req.body.courseName;
//   const grade = req.body.grade;
//   const courseId = await db.getCourseIdByCourseName(courseName);


//   try {
//     const saved = await db.saveGrade(studentId, courseId, grade);

//     if(saved) {
//       res.status(200).json({message: "Grade added successfully!"});
//     } else {
//       res.status(500).json({message: "Failed to add grade."});
//     }

//   } catch (error) {
//     res.status(500).json({message: "Error adding grade.", error});
//   }

// });


app.get('/getStudent', jwtMiddleware, async (req, res) => {

  // Validate student ID
  if(!req.user.mongoid) {
    return res.status(400).json({message: 'Student ID required'});
  }

  try {
    const student = await db.getStudent(req.user.mongoid);

    if(!student) {
      return res.status(404).json({message: 'Student not found'});
    }

    // Only return necessary fields
    const response = {
      id: student.id,
      name: student.name,
      email: student.email
    };

    res.status(200).json(response);

  } catch (error) {

    // Add better error handling
    if(error.kind === 'ObjectId') {
      return res.status(404).json({message: 'Student not found'});
    }

    console.error(error);
    res.status(500).json({message: 'Error retrieving student'});
  }

});


app.get('/getAllCourses', jwtMiddleware, async (req, res) => {
  try {
    const courses = await db.getAllCourses(req.user.mongoid);
    if (!courses) {
      return res.status(404).json({ message: 'Courses not found for this student.' });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses.' });
  }
});


////////////////////////////////////////////////////////////
// This seems to be redundant
////////////////////////////////////////////////
// app.get('/getCourse/:courseId', jwtMiddleware, async (req, res) => {

//   try {

//     // Validate courseId parameter
//     if(!req.params.courseId) {
//       return res.status(400).json({error: 'Course ID required'});
//     }

//     // Get course from database
//     const course = await db.getCourse(req.params.courseId);

//     // Handle not found
//     if(!course) {
//       return res.status(404).json({error: 'Course not found'});
//     }

//     // Return subset of fields
//     const response = {
//       id: course._id,
//       name: course.name,
//       points: course.points
//     };

//     res.json(response);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Error getting course'});
//   }

// });


/////////////////////////
// This seems to be redundant
////////////////////////////
// app.get('/grades/:courseId', jwtMiddleware, async (req, res) => {

//   try {

//     // Validate courseId parameter
//     if(!req.params.courseId) {
//       return res.status(400).json({error: 'Course ID required'});
//     }

//     // Get grade from database
//     const grade = await db.getGrade(req.user.mongoid, req.params.courseId);

//     // Handle not found case
//     if(!grade) {
//       return res.status(404).json({error: 'Grade not found'});
//     }

//     // Only return grade value
//     res.json({
//       grade: grade.value
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Error getting grade'});
//   }

// });

app.get('/averageGrade/:courseName', jwtMiddleware, async (req, res) => {
  try {
      // Get courseId from request params and studentId from the JWT token
      const { courseName } = req.params;
      const courseId = await db.getCourseIdByCourseName(courseName);
      const studentId = req.user.mongoid;

      console.log("Course ID: " + courseId);

      // Validate required params
      if (!courseId || !studentId) {
          return res.status(400).json({ error: 'Course ID and Student ID are required' });
      }

      // Fetch assignments from database for the given course and student
      const assignments = await db.getAssignments(studentId, courseId);

      if (!assignments || assignments.length === 0) {
          return res.status(404).json({ error: 'No assignments found for the given course and student' });
      }

      // Calculate the weighted average grade
      let sumWeightedGrades = 0;
      let sumWeights = 0;
      assignments.forEach(assignment => {
          sumWeightedGrades += assignment.weight * assignment.grade;
          sumWeights += assignment.weight;
      });
      const averageGrade = sumWeightedGrades / sumWeights;

      // Return the calculated average grade
      res.json({ averageGrade: averageGrade.toFixed(2) });  // rounded to 2 decimal places

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching the average grade' });
  }
});


app.get('/getAssignments/:courseName/', jwtMiddleware, async (req, res) => {

  try {

    // Get courseId and studentId from request params
    const { courseName } = req.params;
    const courseId = await db.getCourseIdByCourseName(courseName);


    // Validate required params
    if(!courseId || !req.user.mongoid) {
      return res.status(400).json({error: 'Course ID and Student ID are required'});
    }

    // Fetch assignments from database
    const assignments = await db.getAssignments(req.user.mongoid, courseId);

    // Return assignments array
    res.json(assignments);

  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Error fetching assignments'});
  }

});



app.get('/currentUser', jwtMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not Authenticated" });
  }


  res.json({ username: req.user.username });
});

app.use("/auth", authRoute);

// app.listen("5000", () => {
//   console.log("Server is running!");
// });
