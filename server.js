const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Skipcut backend running");
});

app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: true });
  }

  execFile("./yt-dlp", ["-f", "best", "-g", url], (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
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
  console.log("Server running");
});
