import { createClient } from 'redis'
import { Config as cfg } from '../constanta'


const redisClient = createClient({
  socket: {
    host: cfg.RedisHost,
    port: cfg.RedisPort,
  },
  password: cfg.RedisPass
});

redisClient.on("connect", () => {
  console.log("🚀 Redis connection established successfully!");
})

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

(async() => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
})()

export default redisClient

