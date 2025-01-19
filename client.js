import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function start() {
    await redisClient.connect();

    redisClient.subscribe('channel-name', (message, channel) => {
        console.log(`Received message: ${message} from channel: ${channel}`);
    });
}

start().catch(console.error);
