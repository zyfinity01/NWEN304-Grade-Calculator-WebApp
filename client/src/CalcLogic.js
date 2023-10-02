//import "../../db.js"

const readline = require('readline');
const { MongoClient, ServerApiVersion } = require('mongodb');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

async function getCollection(collectionName) {
    const conn = await connect();
    return conn.db('gradeapp').collection(collectionName); 
}

async function saveGrade(course, gradeLetter) {
    const collection = await getCollection('courses'); // Save to the 'courses' collection
    const result = await collection.insertOne({ course, grade: gradeLetter });
    return result.insertedCount > 0;
}

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

rl.question('Enter the course name: ', (course) => {
    rl.question('Enter the score: ', async (scoreStr) => {
        const score = parseInt(scoreStr, 10);
        const gradeLetter = calculateGrade(score);

        if (gradeLetter === 'Invalid input') {
            console.error('Please provide a valid score.');
            rl.close();
            return;
        }

        try {
            const saved = await saveGrade(course, gradeLetter);
            if (saved) {
                console.log(`Saved the grade for course "${course}": ${gradeLetter}`);
            } else {
                console.error('Failed to save the grade to MongoDB.');
            }
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
        } finally {
            rl.close();
        }
    });
});
