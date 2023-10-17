const {MongoClient, ServerApiVersion} = require('mongodb');

async function connect() {
    const uri = process.env.MONGO_URL.slice(1, -1)
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    return client.connect();
}

async function getCollection(collectionName) {
    const conn = await connect();
    return conn.db(process.env.MONGO_DB_NAME).collection(collectionName);
}

async function getStudent(studentId) {
    const students = await getCollection('students');
    return students.findOne({studentId});
}

async function getCourse(courseId) {
    const courses = await getCollection('courses');
    return courses.findOne({courseId});
}

async function putStudent(studentId, document) {
    const students = await getCollection('students');
    try {
        await students.insertOne({
            ...document
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function putCourse(courseId, document) {
    const courses = await getCollection('courses');
    try {
        await courses.insertOne({
            ...document
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function updateStudent(studentId, document) {
    const students = await getCollection('students');
    try {
        await students.updateOne({studentId}, {$set: document});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function updateCourse(courseId, document) {
    const courses = await getCollection('courses');
    try {
        await courses.updateOne({courseId}, {$set: document});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteStudent(studentId) {
    const students = await getCollection('students');
    try {
        await students.deleteOne({studentId});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteCourse(courseId) {
    const courses = await getCollection('courses');
    try {
        await courses.deleteOne({courseId});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function testConnection() {
    const conn = await connect();
    const result = await conn.db(process.env.MONGO_DB_NAME).command({ping: 1});
    return result.ok === 1;
}

testConnection().then((result) => {
    console.log('MongoDB connection test result: ', result);
});
