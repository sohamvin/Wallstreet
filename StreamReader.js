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



// Initialize an object to track lastId for each stream
const lastIds = companies.reduce((acc, company) => {
    acc[company] = '0'; // Initialize with '0' for each company
    return acc;
}, {});

// Function to listen to a Redis stream and insert data into MongoDB
async function listenToStream(sName, lastId) {
    while (true) {
        try {
            // Read messages from the stream, blocking until new data arrives
            const result = await redis.xread('BLOCK', 500, 'COUNT', 20, 'STREAMS', sName + '_market', lastId);

            if (result && result.length > 0) {
                const messages = result[0][1]; // Extract messages

                console.log(`Documents that we got in bulk read = ${messages}`)

                const documents = [];
                for (const message of messages) {
                    const messageId = message[0];
                    const messageData = message[1];

                    console.log(`Read from ${sName}_market: ID: ${messageId}, Data: ${JSON.stringify(messageData)}`);

                    // Prepare the document for insertion into MongoDB
                    documents.push({
                        messageId,
                        messageData,
                        timestamp: new Date(), // Add timestamp
                    });

                    console.log(documents)

                    // If using consumer groups, use XACK instead of XDEL
                    await redis.xdel(sName + '_market', messageId);
                }

                // Insert the documents into the corresponding MongoDB collection
                // const collection = db.collection(`${companyId}_data`);

                if (documents.length > 1) {
                    try {
                        await insertMany(documents, sName + '_data');
                        console.log(`Inserted ${documents.length} documents into ${sName}_data`);
                    } catch (error) {
                        console.error('Error inserting documents:', error);
                    }
                    
                }

                // Update lastId to the last processed message's ID
                lastId = messages[messages.length - 1][0];
            } else {
                console.log(`No new messages in ${sName}_market. Checking again...`);
            }
        } catch (error) {
            console.error(`Error reading from ${sName}_market:`, error);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
        }
    }
}

// Start listening to all streams concurrently
async function startListening() {
    // Initialize MongoDB connection
    await initMongo();

    const listeners = companies.map(company => {
        const streamName = `${company}`; // Use the original casing as per your publishing
        let lastId = lastIds[company]; // Use the lastId from the tracking object
        return listenToStream(streamName, lastId);
    });

    await Promise.all(listeners); // Run all listeners concurrently
}

startListening();
