
import "dotenv/config";
import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

/** @type {any} */
let redis;

if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
) {
    redis = new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    console.log("Connected to Upstash Redis");

} else {
    redis = new IORedis(
        process.env.REDIS_URL || "redis://localhost:6379"
    );

    redis.on("connect", () => {
        console.log("Connected to Local Redis");
    });
}

export { redis };
