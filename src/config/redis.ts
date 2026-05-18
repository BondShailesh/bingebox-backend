import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err: any) => {
  console.log("Redis Error:", err);
});

export const connectRedis = async () => {
  await redisClient.connect();
// const keys = await redisClient.keys('*');
// const value = await redisClient.get(keys[0]);
  console.log("Redis Connected");
};