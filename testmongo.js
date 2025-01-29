import { Redis } from 'ioredis'; // Import Redis from ioredis
import { MongoClient } from 'mongodb';

// Initialize Redis connection
const redis = new Redis(); // Connect to default Redis server (localhost:6379)

// List of company names, each corresponding to a different stream
const companies = [
    "Google", "Facebook", "Instagram", "Spotify", "Dropbox",
    "Reddit", "Netflix", "Pinterest", "Quora", "YouTube",
    "Lyft", "Uber", "LinkedIn", "Slack", "Etsy",
    "Mozilla", "NASA", "IBM", "Intel", "Microsoft"
];

const mongoUrl = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL
const dbName = 'wallstreet';
let db; // MongoDB database connection

// Initialize MongoDB connection
async function initMongo() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
}

const insertOne =  async (document, name) => {
    const result = await db.collection(name).insertOne(document);
    return result
}


const insertMany =  async (documents, name) => {
    const result = await db.collection(name).insertMany(documents);
    return result
}



// // Call initMongo and wait for it to complete before writing
// async function main() {
//     await initMongo(); // Ensure MongoDB is initialized

//     await write(); // Call write after initialization
// }

async function write() {
    // Ensure you are accessing the collection correctly
    const result = await db.collection('Google_market').insertOne({"timestamp": "!@#!@@@", "price": 10.22});
    console.log(`Inserted document with _id: ${result.insertedId}`);
}

// Start the main function
main().catch(console.error);
