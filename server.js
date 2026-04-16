const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("Skipcut backend running");
});

// --------------------
// STREAM ENDPOINT (FIXED + STRICT + RELIABLE)
// --------------------
app.get("/stream", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: true });

  // STRICT SAFE FORMATS (prioritize real browser-playable MP4)
  const formats = [
    "best[ext=mp4][vcodec!=none][acodec!=none]",
    "best[ext=mp4]",
    "18",
    "22",
    "best"
  ];

  function tryFormat(i) {
    if (i >= formats.length) {
      return res.json({ error: true });
    }

    execFile("./yt-dlp", ["-f", formats[i], "-g", url], (err, stdout) => {
      const stream = stdout ? stdout.trim() : "";

      // reject bad or multi-line outputs
      if (err || !stream || stream.includes("\n")) {
        return tryFormat(i + 1);
      }

      return res.json({ stream });
    });
  }

  tryFormat(0);
});

// --------------------
// INFO ENDPOINT (TITLE + THUMBNAIL)
// --------------------
app.get("/info", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: true });

  execFile("./yt-dlp", ["--dump-json", url], (err, stdout) => {
    if (err || !stdout) return res.json({ error: true });

    try {
      const data = JSON.parse(stdout);

      return res.json({
        title: data.title || "Unknown title",
        thumbnail: data.thumbnail || ""
      });
    } catch {
      return res.json({ error: true });
    }
  });
});

// --------------------
// DOWNLOAD (simple redirect fallback)
// --------------------
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Missing URL");

  // simple fallback (safe external handler approach)
  return res.redirect(
    `https://www.y2mate.com/youtube/${encodeURIComponent(url)}`
  );
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
