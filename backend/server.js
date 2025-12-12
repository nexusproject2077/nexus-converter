const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sert le frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint principal de téléchargement
app.get('/download', (req, res) => {
    const { url, format } = req.query;

    if (!url || !['video', 'audio'].includes(format)) {
        return res.status(400).send('URL ou format invalide');
    }

    const ext = format === 'video' ? 'mp4' : 'mp3';
    res.setHeader('Content-Disposition', `attachment; filename="nexus-download.${ext}"`);
    res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');

    // Commande yt-dlp avec cookies + flags anti-bot
    let args = [
        '--cookies', 'cookies.txt',                    // ← CLÉ MAGIQUE
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '--referer', 'https://www.youtube.com/',
        '--no-playlist',
        '--sleep-interval', '1',
        url,
        '-o', '-'                                      // sortie directe vers le client
    ];

    if (format === 'video') {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
        args.push('--merge-output-format', 'mp4');
    } else {
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    }

    const ytCmd = `./yt-dlp ${args.map(arg => `"${arg}"`).join(' ')}`;
    const process = exec(ytCmd);

    process.stdout.pipe(res);
    process.stderr.on('data', (data) => console.log(`yt-dlp: ${data}`));

    process.on('error', (err) => {
        console.error('Erreur yt-dlp:', err);
        if (!res.headersSent) res.status(500).send('Erreur serveur');
    });

    req.on('close', () => process.kill());
});

// Toutes les autres routes → index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Nexus Converter LIVE → https://nexus-converter.onrender.com`);
});
