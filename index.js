const list_of_companies = [
    "Google", "Facebook", "Instagram", "Spotify", "Dropbox"
];

import express from 'express';
import { createServer } from 'http';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// MongoDB connection setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/wallstreet'; // Update as per your environment
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", 
        methods: ['GET', 'POST'],
    },
});

// API to fetch data by company ID
// API to fetch data by company ID
// API to fetch data by company ID
app.get('/api/company/:id', async (req, res) => {
    const companyId = req.params.id;
    const collectionName = `${companyId}_data`;

    try {
        const data = await mongoose.connection
            .collection(collectionName)
            .find({})
            .sort({ timestamp: 1 }) // Sort by time in ascending order
            .toArray();

        if (data.length === 0) {
            return res.status(404).send(`No data found for company: ${companyId}`);
        }

        // Convert messageData array to an object
        const messageDataOnly = data.map(item => {
            if (Array.isArray(item.messageData)) {
                let obj = {};
                for (let i = 0; i < item.messageData.length; i += 2) {
                    obj[item.messageData[i]] = item.messageData[i + 1];
                }
                return obj;
            }
            return item.messageData; // In case messageData is already an object
        });

        res.send(messageDataOnly); // Send the transformed messageData as an array of objects
    } catch (error) {
        console.error('Error fetching company data:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Create Redis command client
const subscriber = createClient();
subscriber.on('error', (err) => console.error('Redis Client Error:', err));

let latestValues = {}; // Store the latest values for each company

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle subscription to company channels
    socket.on('subscribeToCompany', (company) => {
        if (list_of_companies.includes(company)) {
            socket.join(company); // Join the socket to the company channel
            console.log(`Socket ${socket.id} subscribed to ${company}`);
            // Send the latest value if available
            if (latestValues[company]) {
                socket.emit('newValue', latestValues[company]);
            }
        }
    });

    socket.on("disconnect", (reason) => {
    console.log("Disconnected from Socket.IO. Reason:", reason);
    });

});

// Function to run clients and subscribe to channels
const runClients = async () => {
    try {
        await subscriber.connect();
        console.log('Command client connected to Redis');
        console.log('Subscriber connected to Redis');

        // Subscribe to each company's channel
        list_of_companies.forEach(company => {
            if(company == "Dropbox"){
                subscriber.subscribe(company, (message, channel) => {
                    console.log(`Received message: ${message} from channel: ${channel}`);
                    latestValues[company] = message; // Store the latest value for the company
                    
                    // Emit new value only to relevant sockets
                    io.to(company).emit('newValue', message); // Emit new value to all sockets in the company room
                });
            }

        });
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};

// Start command client
runClients().catch(console.error);

// Start Express server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down command client...');
    commandClient.quit();
    server.close(() => process.exit());
});
