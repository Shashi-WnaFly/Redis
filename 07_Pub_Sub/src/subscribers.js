import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notification", (err) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
    return;
  }
  console.log("Subscribed successfully");
});

subscriber.on("message", (channel, message) => {
  console.log(
    "Received message from channel: ",
    channel,
    "Message: ",
    JSON.parse(message),
  );
});
