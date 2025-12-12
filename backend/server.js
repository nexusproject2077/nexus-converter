const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sert le frontend (ça marche même si le serveur crash après)
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint download
app.get('/download', (req, res) => {
    const { url, format } = req.query;
    if (!url || !['video', 'audio'].includes(format)) {
        return res.status(400).send('URL ou format manquant');
    }

    // Nom de fichier par défaut (on ne récupère plus le titre → plus de crash)
    const ext = format === 'video' ? 'mp4' : 'mp3';
    res.setHeader('Content-Disposition', `attachment; filename="nexus-download.${ext}"`);
    res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');

    // Commande yt-dlp directe (appel relatif + fichier local)
    let args = [
        '--no-playlist',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '--referer', 'https://www.youtube.com/',
        url,
        '-o', '-'  // sortie directe
    ];

    if (format === 'video') {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
        args.push('--merge-output-format', 'mp4');
    } else {
        args.push('-x', '--audio-format', 'mp3');
    }

    const ytCmd = `./yt-dlp ${args.join(' ')}`;
    const process = exec(ytCmd);

    process.stdout.pipe(res);
    process.stderr.pipe(process.stdout); // pour voir les logs si besoin

    process.on('error', (err) => {
        console.error('yt-dlp error:', err);
        if (!res.headersSent) res.status(500).send('Erreur yt-dlp');
    });

    req.on('close', () => process.kill());
});

// Route finale → index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Nexus Converter live → https://nexus-converter.onrender.com`);
});
