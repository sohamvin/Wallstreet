import { Redis } from 'ioredis';
const redis = new Redis();


// List of company names, each corresponding to a different stream
const companies = [
    "Google", "Facebook", "Instagram", "Spotify", "Dropbox",
    "Reddit", "Netflix", "Pinterest", "Quora", "YouTube",
    "Lyft", "Uber", "LinkedIn", "Slack", "Etsy",
    "Mozilla", "NASA", "IBM", "Intel", "Microsoft"
];

async function initMongo() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
}

// Initialize an object to track lastId for each stream
const lastIds = companies.reduce((acc, company) => {
    acc[company] = '0'; // Initialize with '0' for each company
    return acc;
}, {});

// Function to listen to a Redis stream
async function listenToStream(sName, lastId) {
    while (true) {
        try {
            // Read messages from the stream, blocking until new data arrives
            const result = await redis.xread('BLOCK', 500, 'COUNT', 20, 'STREAMS', sName, lastId);

            if (result && result.length > 0) {
                const messages = result[0][1]; // Extract messages

                for (const message of messages) {
                    const messageId = message[0];
                    const messageData = message[1];

                    console.log(`Read from ${sName}: ID: ${messageId}, Data: ${JSON.stringify(messageData)}`);

                    // If using consumer groups, use XACK instead of XDEL
                    await redis.xdel(sName, messageId);
                }

                // Update lastId to the last processed message's ID
                lastId = messages[messages.length - 1][0];
            } else {
                console.log(`No new messages in ${sName}. Checking again...`);
            }
        } catch (error) {
            console.error(`Error reading from ${sName}:`, error);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
        }
    }
}

// Start listening to all streams concurrently
async function startListening() {
    const listeners = companies.map(company => {
        const streamName = `${company}_market`; // Use the original casing as per your publishing
        let lastId = lastIds[company]; // Use the lastId from the tracking object
        return listenToStream(streamName, lastId);
    });

    await Promise.all(listeners); // Run all listeners concurrently
}


startListening();
