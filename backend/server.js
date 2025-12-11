const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sert le frontend statique
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint de téléchargement
app.get('/download', async (req, res) => {
    const { url, format } = req.query;

    if (!url || !format || !['video', 'audio'].includes(format)) {
        return res.status(400).send('Paramètres manquants ou invalides');
    }

    try {
        // Récupère les métadonnées pour le titre
        const metadataCmd = `yt-dlp --dump-json --no-download "${url}"`;
        exec(metadataCmd, (err, stdout) => {
            if (err) throw err;
            const info = JSON.parse(stdout);
            const safeTitle = (info.title || 'nexus-file').replace(/[^a-zA-Z0-9]/g, '_');
            const ext = format === 'video' ? 'mp4' : 'mp3';

            // Headers pour téléchargement direct
            res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${ext}"`);
            res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');

            // Commande yt-dlp avec flags anti-bot (user-agent réaliste, rate limit)
            let args = [
                url,
                '--no-check-certificate',  // Évite erreurs SSL
                '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  // Simule un navigateur
                '--sleep-interval', '1',   // Pause anti-rate-limit
                '--max-sleep-interval', '5',
                '--socket-timeout', '10',
                '-o', '-'  // Sortie sur stdout pour streaming
            ];

            if (format === 'video') {
                args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]');
                args.push('--merge-output-format', 'mp4');
            } else {
                args.push('-f', 'bestaudio[ext=m4a]');
                args.push('--extract-audio', '--audio-format', 'mp3', '--audio-quality', '192K');
            }

            const ytCmd = `yt-dlp ${args.join(' ')}`;

            const process = exec(ytCmd);
            process.stdout.pipe(res);

            process.on('error', (err) => {
                console.error('Erreur yt-dlp:', err);
                if (!res.headersSent) res.status(500).send('Erreur de traitement (bot detection ? Essayez une autre URL)');
            });

            req.on('close', () => process.kill());
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('URL invalide ou plateforme non supportée');
    }
});

// Route catch-all pour le frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Nexus Converter lancé sur http://0.0.0.0:${PORT}`);
});
