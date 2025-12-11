// script.js - Logique du frontend Nexus Converter

document.addEventListener('DOMContentLoaded', () => {
    const liveTimeEl = document.getElementById('live-time');
    const urlInput = document.getElementById('url-input');
    const formatSelect = document.getElementById('format-select');
    const convertBtn = document.getElementById('convert-btn');
    const progress = document.getElementById('progress');
    const progressBar = document.getElementById('progress-bar');
    const statusMessage = document.getElementById('status-message');

    // Mise à jour de l'heure en direct
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        liveTimeEl.textContent = timeString;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Conversion et téléchargement
    convertBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const format = formatSelect.value;

        if (!url) {
            statusMessage.textContent = '⚠️ Veuillez entrer une URL valide.';
            statusMessage.style.color = '#ff6b6b';
            return;
        }

        statusMessage.textContent = '⏳ Traitement en cours...';
        statusMessage.style.color = '#00ffcc';
        progress.style.display = 'block';
        progressBar.style.width = '0';

        // URL du backend (change si ton serveur est ailleurs)
        const backendUrl = `http://localhost:3000/download?url=${encodeURIComponent(url)}&format=${format}`;

        // Créer un lien invisible pour déclencher le téléchargement direct
        const link = document.createElement('a');
        link.href = backendUrl;
        link.download = '';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Simulation visuelle de progression (le vrai download est géré par le serveur)
        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += 15;
            progressBar.style.width = `${progressValue}%`;
            if (progressValue >= 100) {
                clearInterval(interval);
                progress.style.display = 'none';
                statusMessage.textContent = '✅ Téléchargement lancé !';
                setTimeout(() => {
                    statusMessage.textContent = '';
                }, 4000);
            }
        }, 300);
    });
});
