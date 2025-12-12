# Version qui marche sur Render Free en 2025
FROM node:18-alpine

# Installe ffmpeg (seulement ça)
RUN apk add --no-cache ffmpeg

# Télécharge yt-dlp directement dans le dossier courant et le renomme en "yt-dlp"
RUN wget -O yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod +x yt-dlp \
    && mv yt-dlp /usr/local/bin/

# Vérifie que c’est bon (tu verras ça dans les logs de build)
RUN yt-dlp --version

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
