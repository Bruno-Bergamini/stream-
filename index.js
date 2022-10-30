const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const torrentStream = require('torrent-stream');
const fs = require('fs');

app.get('/movies/', (req, res) => {
    const engine = torrentStream('magnet:?xt=urn:btih:1D38AAC906340B09176116048DE3AAB746983E9B&dn=Rambo+III+%281988%29+%5B720p%5D+%5BYTS.MONSTER%5D&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337');
    engine.on('ready', function() {
        const file = engine.files.find(file => file.name.endsWith(".mp4"));
        const { range } = req.headers;
        const start = Number(range.replace(/\D/g, ""));
        const size = file.length;
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
        const torrentStream = file.createReadStream({start, end});
        torrentStream.pipe(res);
    });
});
app.listen(3000, () => console.log('VideoFlix Server!'));