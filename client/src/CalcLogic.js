// CalcLogic.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection to MongoDB
async function connect() {
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

// Get the respective collection
async function getCollection(collectionName) {
    const conn = await connect();
    return conn.db('gradeapp').collection(collectionName);
}

// Save the grade to MongoDB
async function saveGrade(studentUsername, course, gradeLetter) {
    const collection = await getCollection('courses');
    const result = await collection.insertOne({ username: studentUsername, course, grade: gradeLetter });
    return result.insertedCount > 0;
}

// Calculate the grade based on score
function calculateGrade(score) {
    if (score >= 90) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else if (score >= 0) {
        return 'F';
    } else {
        return 'Invalid input';
    }
}

// Function to handle grade calculation and save to MongoDB
async function handleGradeCalculation(studentUsername, course, score) {
    const gradeLetter = calculateGrade(score);

    if (gradeLetter === 'Invalid input') {
        console.error('Please provide a valid score.');
        return;
    }

    try {
        const saved = await saveGrade(studentUsername, course, gradeLetter);
        if (saved) {
            console.log(`Saved the grade for course "${course}": ${gradeLetter}`);
        } else {
            console.error('Failed to save the grade to MongoDB.');
        }
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
    }
}

module.exports = { handleGradeCalculation };
