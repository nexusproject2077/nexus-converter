FROM node:18-alpine

# Installe seulement ffmpeg (le seul vrai besoin)
RUN apk add --no-cache ffmpeg curl

# Télécharge le binaire yt-dlp standalone (aucune dépendance Python)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp

# Vérifie que ça marche
RUN yt-dlp --version

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
