import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const emailQueueKey = "email:queue";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.content || "No content",
    createdAt: new Date().toISOString(),
  };
  await redis.rpush(emailQueueKey, JSON.stringify(job));
  res.json({ queued: true, email: job });
});

app.get("/emails/process", async (req, res) => {
  const rawJob = await redis.lpop(emailQueueKey);
  if (!rawJob) return res.json({ message: "No jobs in the queue." });
  res.json({ message: "Email sent", email: JSON.parse(rawJob) });
});

app.listen(3000, () => {
    console.log("server is running on http://localhost:3000")
})
