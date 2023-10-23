const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const bcrypt = require('bcrypt'); // For password hashing

let dbClient;


async function connect() {
    // if (dbClient && dbClient.isConnected()) {
    //     return dbClient;
    // }

    const uri = process.env.MONGO_URL.slice(1, -1);
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },

    });

    dbClient = await client.connect();
    return dbClient;
}

function close() {
    if (dbClient) {
        dbClient.close();
    }
}

// function connect() {
//     const uri = process.env.MONGO_URL.slice(1, -1);
//     const client = new MongoClient(uri, {
//         serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//         }
//     });
//     return client.connect();
// }

function registerUser(username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash password
    return getCollection('users').then(users => {
        return users.insertOne({username: username, password: hashedPassword});
    });
}

function getUserByUsername(username) {
    return getCollection('users').then(users => {
        return users.findOne({username: username});
    });
}

function getUserByOauthId(oauthId) {
    return getCollection('students').then(students => {
        return students.findOne({oauthId: oauthId});
    });
}

async function getCollection(collectionName) {
    const conn = await connect();
    return conn.db(process.env.MONGO_DB_NAME).collection(collectionName);
}

function getStudent(studentId) {
    return getCollection('students').then(students => {
        return students.findOne({_id: new ObjectId(studentId)});
    });
}

function getCourse(courseId) {
    return getCollection('courses').then(courses => {
        return courses.findOne({_id: new ObjectId(courseId)});
    });
}

function getCourseIdByCourseName(courseName) {
    return getCollection('courses').then(courses => {
        return courses.findOne({courseName: courseName}).then(course => {
            if (!course) throw new Error("Course not found");
            return course._id;
        });
    });
}


function getAllCourses(studentId) {
    return getCollection('courses').then(courses => {
        return courses.find({studentId: new ObjectId(studentId)}).toArray();
    });
}

function getAssignments(studentId, courseId) {
    return getCollection('assignments').then(assignments => {
        return assignments.find({
            studentId: new ObjectId(studentId),
            courseId: new ObjectId(courseId)
        }).toArray();
    });
}

function getAssignment(studentId, courseId, assignmentName) {
    return getCollection('assignments').then(assignments => {
        return assignments.findOne({
            studentId: new ObjectId(studentId),
            courseId: new ObjectId(courseId),
            name: assignmentName // Using MongoDB's default ID field to find the assignment
        });
    });
}

function saveGrade(studentId, courseId, grade) {
    const studentObjectId = new ObjectId(studentId);
    const courseObjectId = new ObjectId(courseId);

    return getCollection('students').then(students => {
        // First, try to remove any existing grade for the same course (to avoid duplicates)
        return students.updateOne({_id: studentObjectId}, {$pull: {grades: {courseId: courseObjectId}}})
            .then(() => {
                // Then, add the new grade for the course
                return students.updateOne({_id: studentObjectId}, {$push: {grades: {courseObjectId, grade}}});
            })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}


function putStudent(studentDocument) {
    const oauthId = studentDocument.oauthId;
    const name = studentDocument.name;
    const username = studentDocument.username;
    const hashedPassword = studentDocument.hashedPassword;

    if (!name) {
        return false;
    }

    if (!oauthId || (!username && !hashedPassword)) {
        return false;
    }

    return getCollection('students').then(students => {
        return students.insertOne({
            oauthId: oauthId,
            name: name,
            username: username,
            hashedPassword: hashedPassword,
            courses: []
        })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function putCourse(studentId, courseDocument) {
    const courseName = courseDocument.courseName;
    const pointValue = courseDocument.pointValue;

    if (!courseName || !pointValue) {
        return false;
    }

    let createdCourse;
    getCollection('courses').then(courses => {
        const doc = courses.insertOne({
            courseName: courseName,
            pointValue: pointValue,
            studentId: new ObjectId(studentId)
        })
            .then(() => createdCourse = doc.insertedId)
            .catch(e => {
                console.log(e);
                return false;
            });
    });

    return addCourseToStudent(studentId, createdCourse);
}

function putAssignment(assignmentDocument) {
    const courseId = assignmentDocument.courseId;
    const studentId = assignmentDocument.studentId;
    const name = assignmentDocument.name;
    const weight = assignmentDocument.weight;
    const grade = assignmentDocument.grade;

    if (!courseId || !studentId || !name || !weight || !grade) {
        return false;
    }

    // Check if the course exists, if not, error
    getCourse(courseId).then(course => {
        if (!course) {
            return false;
        }
    })

    // Check if the student exists, if not, error
    getStudent(studentId).then(student => {
        if (!student) {
            return false;
        }
    })

    return getCollection('assignments').then(assignments => {
        return assignments.insertOne({
            courseId: new ObjectId(courseId),
            studentId: new ObjectId(studentId),
            name: name,
            weight: weight,
            grade: grade
        })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function updateStudent(studentId, document) {
    return getCollection('students').then(students => {
        return students.updateOne({_id: new ObjectId(studentId)}, {$set: document})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function addCourseToStudent(studentId, courseId) {
    return getCollection('students').then(students => {
        return students.updateOne({_id: new ObjectId(studentId)}, {$push: {courses: {courseId: new ObjectId(courseId)}}})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function updateCourse(courseId, document) {
    return getCollection('courses').then(courses => {
        return courses.updateOne({_id: new ObjectId(courseId)}, {$set: document})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function updateAssignment(assignmentId, document) {
    return getCollection('assignments').then(assignments => {
        return assignments.updateOne({_id: new ObjectId(assignmentId)}, {$set: document})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function deleteStudent(studentId) {
    return getCollection('students').then(students => {
        return students.deleteOne({_id: new ObjectId(studentId)})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function deleteCourse(courseId) {
    // Get student id from course
    const studentId = getCourse(courseId).studentId;

    getCollection('courses').then(courses => {
        return courses.deleteOne({_id: new ObjectId(courseId)})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });

    // Delete from student
    return getCollection('students').then(students => {
        return students.updateOne({_id: studentId}, {$pull: {courses: {courseId: courseId}}})
    });
}

function deleteAssignment(assignmentId) {
    return getCollection('assignments').then(assignments => {
        return assignments.deleteOne({_id: new ObjectId(assignmentId)})
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function testConnection() {
    return connect().then(conn => {
        return conn.db(process.env.MONGO_DB_NAME).command({ping: 1});
    })
        .then(result => result.ok === 1);
}

function testPrintCourses() {
    getCourse('652dea678676005f3f1fb2e5').then(course => {
        console.log(course);
    });
}

testConnection().then(result => {
    console.log('MongoDB connection test result: ', result);
    testPrintCourses();
});

module.exports = {
    registerUser,
    getUserByUsername,
    connect,
    getCollection,
    getStudent,
    getUserByOauthId,
    getCourse,
    getCourseIdByCourseName,
    getAllCourses,
    getAssignment,
    getAssignments,
    updateAssignment,
    saveGrade,
    putStudent,
    putCourse,
    putAssignment,
    addCourseToStudent,
    updateStudent,
    updateCourse,
    deleteStudent,
    deleteCourse,
    testConnection
};
