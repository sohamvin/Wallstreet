import express from 'express';
import { createServer } from 'http';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Replace '*' with your frontend origin for security
        methods: ['GET', 'POST'],
    },
});

// Create Redis command client
const commandClient = createClient();
commandClient.on('error', (err) => console.error('Redis Client error for command : ', err));
const subscriber = createClient();
subscriber.on('error', (err) => console.error('Redis Client Error:', err));


let latestValue; // Store the latest value for new clients

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send the latest value to the newly connected client
    if (latestValue) {
        socket.emit('newValue', latestValue);
    }

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


const runClients = async () => {
    try {
        await subscriber.connect();
        await commandClient.connect();
        console.log('Command client connected to Redis');
        console.log('Subscriber connected to Redis');

        // Subscribe to the Redis channel
        await subscriber.subscribe('randomNumberChannel', (message, channel) => {
            console.log(`Received message: ${message} from channel: ${channel}`);
            latestValue = message;

            try {
                const data = JSON.parse(message);
                console.log('Parsed data:', data);
                io.emit('newValue', data); // Emit new value to all connected clients
            } catch (err) {
                console.error('Failed to parse message:', err);
            }
        });
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};


// Connect command client

app.get("/api/data", async (req, res) => {
    try {
        const queueName = 'stockval';
        const start = 0;
        const end = -1;
        const range = await commandClient.lRange(queueName, start, end);
        return res.send(range);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

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
