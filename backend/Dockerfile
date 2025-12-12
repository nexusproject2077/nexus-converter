FROM node:18-alpine

RUN apk add --no-cache ffmpeg wget

# Télécharge yt-dlp et le met dans /app (WORKDIR)
RUN wget -O yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    && chmod +x yt-dlp

# Ajoute au PATH
ENV PATH="/app:${PATH}"

# Vérifie
RUN ./yt-dlp --version

WORKDIR /app
COPY yt-dlp ./
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
