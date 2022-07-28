import { createClient } from "redis";
export const redis = createClient();

export const redixConnect = async () => {
  await redis.connect();
  console.log(`Redis Connected`);
};
