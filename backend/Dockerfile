FROM node:18-alpine

# Installe ffmpeg (nécessaire pour merger vidéo + audio)
RUN apk add --no-cache ffmpeg

# Télécharge yt-dlp standalone
RUN wget -O /usr/local/bin/yt-dlp \
    https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp

# Vérifie que c’est bien installé (tu verras la version dans les logs de build)
RUN yt-dlp --version

# Dossier de travail
WORKDIR /app

# Installe les dépendances Node
COPY package*.json ./
RUN npm ci --only=production

# Copie tout le code backend
COPY . .

# Port
EXPOSE 3000

# Démarre le serveur
CMD ["npm", "start"]
