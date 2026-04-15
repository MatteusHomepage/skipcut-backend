const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Skipcut backend running");
});

// Stream endpoint (FINAL WORKING VERSION)
app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: true });
  }

  // Try multiple formats: 18 = safest MP4, 22 = HD MP4, fallback = best
  execFile("./yt-dlp", ["-f", "18/22/best", "-g", url], (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.json({ error: true });
    }

    const stream = stdout.trim();

    if (!stream) {
      return res.json({ error: true });
    }

    res.json({ stream });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
