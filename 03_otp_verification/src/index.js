import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import crypto from "crypto";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const redisRes = await redis.ping();
  res.json({ redis: redisRes });
});

app.get("/mongo", async (req, res) => {
  try {
    const url =
      process.env.MONGO_URL || "mongodb://localhost:27017/learn_redis";
    await mongoose.connect(url);
    res.json({ mongo: "connected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const otpKey = (phone) => `otp:${phone}`;

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = await crypto.randomInt(100000, 999999);
  await redis.set(otpKey(phone), otp, "EX", 30);
  res.json({ success: true, otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phone));
  if (!storedOtp) return res.json({ message: "OTP expired!!" });
  if (otp != storedOtp) return res.json({ message: "Otp is invalid!" });
  await redis.del(otpKey(phone));
  res.json({ success: true, message: "OTP verified successfully." });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));
  res.json({ ttl: ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
