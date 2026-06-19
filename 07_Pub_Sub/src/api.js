import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notification", async (req, res) => {
  const payload = {
    title: req.body.title,
    createdAt: new Date().toISOString(),
  };
  const receivers = await publisher.publish("notification", JSON.stringify(payload));
  res.status(201).send(`Notification sent to ${receivers} receivers`);
});

app.listen(3000, () => {
  console.log("API server listening on port http://localhost:3000");
});
