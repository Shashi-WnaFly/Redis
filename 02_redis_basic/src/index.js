import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "Hello hi kem cho");
  res.json({ success: true });
});

app.get("/banner", async (req, res) => {
  if (redis.exists(BANNER_KEY))
    return res.json({ banner: await redis.get(BANNER_KEY) });
  res.json({ success: false });
});

app.get("/banner/exists", async (req, res) => {
  const isExist = await redis.exists(BANNER_KEY);
  console.log(isExist);
  res.json({ success: Boolean(isExist) });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
