const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/stream', (req, res) => {
  const url = req.query.url;

  exec(`yt-dlp -f best -g "${url}"`, (err, stdout) => {
    if (err) return res.json({ error: true });

    res.json({ stream: stdout.trim() });
  });
});

app.get('/download', (req, res) => {
  const url = req.query.url;

  exec(`yt-dlp -f best "${url}" -o -`, (err, stdout) => {
    if (err) return res.send("Download failed");

    res.setHeader('Content-Disposition', 'attachment; filename=\"video.mp4\"');
    res.send(stdout);
  });
});

app.listen(3000);
