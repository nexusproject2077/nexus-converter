FROM node:18-alpine

# Installe ffmpeg
RUN apk add --no-cache ffmpeg

# Télécharge yt-dlp dans le dossier courant et rend-le exécutable
RUN wget -O yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod +x yt-dlp

# Vérifie que yt-dlp marche (tu verras ça dans les logs de build)
RUN ./yt-dlp --version

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Copie yt-dlp dans le dossier final
COPY yt-dlp .

EXPOSE 3000
CMD ["npm", "start"]
