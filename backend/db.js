const { MongoClient, ServerApiVersion } = require('mongodb');

function connect() {
    const uri = process.env.MONGO_URL.slice(1, -1);
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    return client.connect();
}

function getCollection(collectionName) {
    return connect().then(conn => {
        return conn.db(process.env.MONGO_DB_NAME).collection(collectionName);
    });
}

function getStudent(studentId) {
    return getCollection('students').then(students => {
        return students.findOne({ studentId });
    });
}

function getCourse(courseId) {
    return getCollection('courses').then(courses => {
        return courses.findOne({ courseId });
    });
}

function saveGrade(studentId, courseId, grade) {
    return getCollection('students').then(students => {
        // First, try to remove any existing grade for the same course (to avoid duplicates)
        return students.updateOne({ studentId }, { $pull: { grades: { courseId: courseId } } })
            .then(() => {
                // Then, add the new grade for the course
                return students.updateOne({ studentId }, { $push: { grades: { courseId, grade } } });
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
    const email = studentDocument.email;
    const coursesArray = studentDocument.courses;

    if (!oauthId || !name || !email || !coursesArray) {
        return false;
    }

    for (let i = 0; i < coursesArray.length; i++) {
        const courseId = coursesArray[i].courseId;

        // Check if the course exists, if not, error
        getCourse(courseId).then(course => {
            if (!course) {
                return false;
            }
        })
    }

    return getCollection('students').then(students => {
        return students.insertOne({
            oauthId: oauthId,
            name: name,
            email: email,
            courses: coursesArray
        })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function putCourse(courseDocument) {
    const courseName = courseDocument.courseName;
    const pointValue = courseDocument.pointValue;

    if (!courseName || !pointValue) {
        return false;
    }

    return getCollection('courses').then(courses => {
        return courses.insertOne({
            courseName: courseName,
            pointValue: pointValue
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
        return students.updateOne({ studentId }, { $set: document })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function updateCourse(courseId, document) {
    return getCollection('courses').then(courses => {
        return courses.updateOne({ courseId }, { $set: document })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function deleteStudent(studentId) {
    return getCollection('students').then(students => {
        return students.deleteOne({ studentId })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function deleteCourse(courseId) {
    return getCollection('courses').then(courses => {
        return courses.deleteOne({ courseId })
            .then(() => true)
            .catch(e => {
                console.log(e);
                return false;
            });
    });
}

function testConnection() {
    return connect().then(conn => {
        return conn.db(process.env.MONGO_DB_NAME).command({ ping: 1 });
    })
        .then(result => result.ok === 1);
}

testConnection().then(result => {
    console.log('MongoDB connection test result: ', result);
});

module.exports = {
    connect,
    getCollection,
    getStudent,
    getCourse,
    saveGrade,
    putStudent,
    putCourse,
    updateStudent,
    updateCourse,
    deleteStudent,
    deleteCourse,
    testConnection
};
