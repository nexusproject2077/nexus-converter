FROM node:18-alpine

# Installe ffmpeg (obligatoire pour merger vidéo + audio)
RUN apk add --no-cache ffmpeg

# Télécharge yt-dlp standalone (sans Python, sans PATH problems)
RUN wget -O yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod +x yt-dlp

# Vérifie que ça marche (tu verras la version dans les logs Render)
RUN ./yt-dlp --version

WORKDIR /app

# Installe Node.js deps
COPY package*.json ./
RUN npm ci --only=production

# Copie tout le code
COPY . .

# Copie yt-dlp dans le dossier final (appel relatif)
COPY yt-dlp .

EXPOSE 3000

CMD ["npm", "start"]
