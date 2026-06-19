import { Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(
      `Processing job ${job.id}, with name: ${job.name} and with data:`,
      job.data,
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Job ${job.id} has been processed`);
  },
  { connection },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed with error: ${err.message}`);
});
