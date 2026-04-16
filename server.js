const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Skipcut backend running");
});

// 🔥 SMART STREAM (multi-format fallback)
app.get("/stream", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: true });

  const format = "best[ext=mp4][acodec!=none]/best[ext=mp4]/best";

  execFile("./yt-dlp", ["-f", format, "-g", url], (err, stdout) => {
    if (err) return res.json({ error: true });

    const stream = stdout.trim();
    if (!stream) return res.json({ error: true });

    res.json({ stream });
  });
});

// 🔥 GET METADATA (title + thumbnail)
app.get("/info", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: true });

  execFile("./yt-dlp", ["--dump-json", url], (err, stdout) => {
    if (err) return res.json({ error: true });

    try {
      const data = JSON.parse(stdout);
      res.json({
        title: data.title,
        thumbnail: data.thumbnail
      });
    } catch {
      res.json({ error: true });
    }
  });
});

// 🔥 DOWNLOAD (fixed)
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Error");

  res.redirect(`https://www.y2mate.com/youtube/${encodeURIComponent(url)}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
