import cron from 'node-cron';
import redis from '../redis/redis.js';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const persistWarrantiesFromRedis = async () => {
    try {
        const entries = await redis.hGetAll('warranties');

        for (const [id, json] of Object.entries(entries)) {
            const warranty = JSON.parse(json);

            try {
                await prisma.warranty.create({ data: warranty });
                await redis.hDel('warranties', id);
                console.log(`Persisted warranty: ${id}`);
            } catch (error) {
                console.error(`Failed to persist warranty ${id}:`, error.message);
            }
        }

        if (Object.keys(entries).length === 0) {
            console.log("ℹ️ No warranties to persist");
        }
    } catch (err) {
        console.error("🚨 Error in batch persistence job:", err.message);
    }
};

// cron.schedule('0 0 * * *', async () => {
//     console.log("🕛 Running warranty persistence cron job");
//     await persistWarrantiesFromRedis();
// });
