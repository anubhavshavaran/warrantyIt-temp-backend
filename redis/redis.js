import {createClient} from 'redis';

const redis = await createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

redis.on('error', (err) => console.log(err));
redis.on('ready', () => console.log('redis is ready'));

await redis.connect();

export default redis;