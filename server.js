const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

// health check
app.get("/", (req, res) => {
  res.send("Skipcut backend running");
});

// stream endpoint
app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: true, message: "No URL provided" });
  }

  // IMPORTANT: yt-dlp must exist in Render environment
  exec(`yt-dlp -f best -g "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: true });
    }

    const streamUrl = stdout.trim();

    if (!streamUrl) {
      return res.status(500).json({ error: true });
    }

    res.json({ stream: streamUrl });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
