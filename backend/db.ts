const { MongoClient, ServerApiVersion, ConnectOptions } = require('mongodb');
const fs = require('fs');

async function connect() {
    const uri = process.env.MONGODB_URI;
    const credentials = fs.readFileSync(process.env.MONGO_CERT_PATH).toString();
    const client = new MongoClient(uri, {
        sslKey: credentials,
        sslCert: credentials,
        serverApi: ServerApiVersion.v1
    } as typeof ConnectOptions);
    return client.connect();
}

async function getCollection(collectionName) {
    const conn = await connect();
    return conn.db(process.env.MONGO_DB_NAME).collection(collectionName);
}

async function testConnection() {
    const conn = await connect();
    const result = await conn.db(process.env.MONGO_DB_NAME).command({ ping: 1 });
    return result.ok === 1;
}

testConnection().then((result) => {
    console.log('MongoDB connection test result: ', result);
});
