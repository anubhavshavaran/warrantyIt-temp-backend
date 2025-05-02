import {createClient} from 'redis';

const redis = await createClient({
    url: process.env.REDIS_URL,
});

redis.on('error', (err) => console.log(err));
redis.on('ready', () => console.log('redis is ready'));

await redis.connect();

export default redis;