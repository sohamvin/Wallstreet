import { createClient } from 'redis';
import { setTimeout } from 'timers/promises';

const publisher = createClient();
const commandClient = createClient();

const CHANNEL_NAME = 'randomNumberChannel';
const LIST_NAME = 'stockval';

const MIN_RANDOM = 1002;
const MAX_RANDOM = 1005;

const MIN_WAIT = 10; // 5 seconds
const MAX_WAIT = 1000; // 10 seconds

const publishRandomNumber = async () => {
    while (true) {
        try {
            const randomNumber = (Math.random() * (MAX_RANDOM - MIN_RANDOM) + MIN_RANDOM).toFixed(2);
            const now = new Date();

            await publisher.publish(CHANNEL_NAME, JSON.stringify({ date: now, num: randomNumber }));
            await commandClient.lPush(LIST_NAME, JSON.stringify({ date: now, num: randomNumber }));

            console.log(`Published: ${randomNumber} at ${now}`);

            const waitTime = Math.floor(Math.random() * (MAX_WAIT - MIN_WAIT)) + MIN_WAIT;
            await setTimeout(waitTime);
        } catch (err) {
            console.error('Error during publishing or pushing data:', err);
        }
    }
};

publisher.on('error', (err) => console.error('Publisher Redis Error:', err));
commandClient.on('error', (err) => console.error('Command Redis Error:', err));

const runPublisher = async () => {
    try {
        await publisher.connect();
        await commandClient.connect();
        console.log('Publisher connected to Redis');
        await publishRandomNumber();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down publisher...');
    await publisher.quit();
    await commandClient.quit();
    process.exit();
});

runPublisher().catch(console.error);
