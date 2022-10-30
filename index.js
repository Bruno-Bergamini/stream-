const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const fs = require('fs');
const WebTorrent = require('webtorrent');
const client = new WebTorrent();

app.get('/movies/', (req, res) => {
    const uri = 'magnet:?xt=urn:btih:35668A968EF766273D9A887CF1EE728AF346EAC8&dn=Rambo%3A+First+Blood+Part+II&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce';
    client.add(uri, torrent => {
      const file = torrent.files.find(file => file.name.endsWith(".mp4"));
      const source = file.createReadStream();
      const destination = fs.createWriteStream("teste.mp4")
      const interval = setInterval(()=> {
        console.log("Progress: " + (torrent.progress * 100).toFixed() + "%")
      }, 1000)
      source.pipe(destination);
      source.on('end', ()=> {
        console.log("Downloaded")
        clearInterval(interval);
        process.exit()
      });
    })
});

app.get('/watch/', (req, res) => {
  const { range } = req.headers;
  const start = Number(range.replace(/\D/g, ""));
  const size = fs.statSync("teste.mp4").size;
  const chunkSize = 10 ** 6;
  const end = Math.min(start + chunkSize, size - 1);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  };
  res.writeHead(206, headers);
  const video = fs.createReadStream("teste.mp4", {start, end})
  video.pipe(res);
});

app.listen(3000, () => console.log('VideoFlix Server!'));