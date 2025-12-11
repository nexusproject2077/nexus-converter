const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;
const cors = require('cors');
const path = require('path');

const app = express();
const ytDlp = new YTDlpWrap();

app.use(cors());
app.use(express.json());

// Servir le frontend statique (le dossier ../frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint de téléchargement
app.get('/download', async (req, res) => {
    const { url, format } = req.query;

    if (!url || !format || !['video', 'audio'].includes(format)) {
        return res.status(400).send('Paramètres manquants ou invalides');
    }

    try {
        const metadata = await ytDlp.execPromise([url, '--dump-json']);
        const info = JSON.parse(metadata);
        const safeTitle = (info.title || 'nexus-file').replace(/[^a-zA-Z0-9]/g, '_');
        const ext = format === 'video' ? 'mp4' : 'mp3';

        res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${ext}"`);
        res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');

        let args = [url];
        if (format === 'video') {
            args.push('-f', 'bestvideo+bestaudio/best');
            args.push('--merge-output-format', 'mp4');
        } else {
            args.push('-f', 'bestaudio');
            args.push('--extract-audio', '--audio-format', 'mp3');
        }
        args.push('-o', '-');

        const ytDlpProcess = ytDlp.exec(args);
        ytDlpProcess.stdout.pipe(res);

        ytDlpProcess.on('error', (err) => {
            console.error('Erreur yt-dlp:', err);
            if (!res.headersSent) res.status(500).send('Erreur de traitement');
        });

        req.on('close', () => ytDlpProcess.kill());

    } catch (err) {
        console.error(err);
        res.status(500).send('URL invalide ou plateforme non supportée');
    }
});

// Route pour toutes les autres pages → renvoyer index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Nexus Converter lancé sur http://localhost:${PORT}`);
});
