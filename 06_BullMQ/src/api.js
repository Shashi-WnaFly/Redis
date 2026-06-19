import express from "express";
import { emailQueue } from "./queue.js";
import { Backoffs, delay } from "bullmq";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "Learner",
      data: req.body.data || "Just a demo email..",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
  res.json({
    message: "Welcome email job has been added to the queue!",
    jobId: job.id,
  });
});

app.listen(3000, () => {
  console.log("API server is running on port http://localhost:3000");
});
