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

async function testConnection() {
    const conn = await connect();
    const result = await conn.db(process.env.MONGO_DB_NAME).command({ping: 1});
    return result.ok === 1;
}

testConnection().then((result) => {
    console.log('MongoDB connection test result: ', result);
});
