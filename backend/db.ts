const {MongoClient, ServerApiVersion} = require('mongodb');
const ENV = process.env;

async function connect() {
    const client = new MongoClient("mongodb+srv://" +
        ENV.MONGO_USER + ":" +
        ENV.MONGO_PASS + "@" +
        ENV.MONGO_SERVER + "/?retryWrites=true&w=majority",
        {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,   
                deprecationErrors: true,
            }
        });
    return client.connect();
}

async function getCollection(collectionName: string) {
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
