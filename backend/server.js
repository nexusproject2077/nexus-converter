const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/download', (req, res) => {
    const { url, format } = req.query;
    if (!url || !['video', 'audio'].includes(format)) {
        return res.status(400).send('Paramètres manquants');
    }

    const ext = format === 'video' ? 'mp4' : 'mp3';
    res.setHeader('Content-Disposition', `attachment; filename="nexus-download.${ext}"`);
    res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');

    let args = [
        '--cookies', 'cookies.txt',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '--referer', 'https://www.youtube.com/',
        '--no-playlist',
        url,
        '-o', '-'
    ];

    if (format === 'video') {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best');
        args.push('--merge-output-format', 'mp4');
    } else {
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    }

    // Escape correct de tous les arguments
    const safeArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);
    const ytCmd = `yt-dlp ${safeArgs.join(' ')}`;

    const process = exec(ytCmd);
    process.stdout.pipe(res);
    process.stderr.pipe(process.stdout);

    process.on('error', err => {
        console.error('yt-dlp error:', err);
        if (!res.headersSent) res.status(500).send('Erreur');
    });

    req.on('close', () => process.kill());
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Nexus Converter LIVE → https://nexus-converter.onrender.com`);
});
