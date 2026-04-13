const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.get('/stream', async (req, res) => {
  const url = req.query.url;

  try {
    const output = await ytdlp(url, {
      format: 'best',
      getUrl: true
    });

    res.json({ stream: output.trim() });

  } catch (err) {
    console.error(err);
    res.json({ error: true });
  }
});

app.listen(3000);
