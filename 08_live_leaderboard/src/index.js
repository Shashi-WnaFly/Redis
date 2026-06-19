import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const bungyLeaderboard = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

const leaderboardKey = (id) => `post:${id}:views`;

app.post("/post/:id/view", async (req, res) => {
  const { id } = req.params;
  const viewCount = await bungyLeaderboard.incr(leaderboardKey(id));
  res.json({ viewCount });
});

app.post("/leaderboard/score", async (req, res) => {
  const { id, score } = req.body;
  const updatedScore = await bungyLeaderboard.zincrby("leaderboard", score, id);
  res.json({ updatedScore });
});

app.get("/leaderboard", async (req, res) => {
  const top10 = await bungyLeaderboard.zrevrange(
    "leaderboard",
    0,
    9,
    "WITHSCORES",
  );
  res.json({ top10 });
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  const { userId } = req.params;
  const userRank = await bungyLeaderboard.zrevrank("leaderboard", userId);
  res.json({ message: `user: ${userId} and rank: ${userRank}` });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:6379");
});
