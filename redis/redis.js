import {createClient} from 'redis';

const redis = await createClient();

redis.on('error', (err) => console.log(err));
redis.on('ready', () => console.log('redis is ready'));

await redis.connect();

export default redis;