import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const userProfileJson = (userId) => `user:${userId}:json`;
const userProfileHash = (userId) => `user:${userId}:hash`;

app.post("/user/:id/json", async (req, res) => {
  await redis.set(userProfileJson(req.params.id), JSON.stringify(req.body));
  res.json({ savedUser: req.params.id, type: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const user = await redis.get(userProfileJson(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: JSON.parse(user), type: "json" });
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(userProfileHash(req.params.id), req.body);
  res.json({ savedUser: req.params.id, type: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userData = await redis.hgetall(userProfileHash(req.params.id));
  res.json({ userData });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
