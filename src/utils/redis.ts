import { createClient } from "redis";
export const redis = createClient({
  socket: {
    host: process.env.REDIS_URL,
    port: 6379
  }
});

export const redixConnect = async () => {
  await redis.connect();
  console.log(`Redis Connected`);
};
