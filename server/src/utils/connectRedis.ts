import { createClient } from "redis";

import logging from "../middleware/logging/logging";
import getConfig from "./getConfig";

const redisClient = createClient({
  url: getConfig("redisUrl"),
  // disableOfflineQueue: true,
  pingInterval: 1000,
});

async function connectRedis() {
  await redisClient.connect();
}

connectRedis();

redisClient.on("connect", async () => {
  logging.log("Connected to Redis server");
  redisClient.set("try", "Hello Wellcome to Rangoon");
});

redisClient.on("error", (err) => {
  logging.error("Failed connecting to redis:", err?.message);

  redisClient.disconnect();
  logging.warn("Redis client closed");
});

redisClient.on("end", () => {
  logging.info("Redis connection has been closed. 😢👋");
});

export default redisClient;
