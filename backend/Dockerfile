# Image de base Node.js légère
FROM node:18-alpine

# Installe les dépendances système nécessaires
RUN apk add --no-cache python3 py3-pip ffmpeg git curl

# Crée les liens pour python et pip (essentiel sur Alpine)
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip

# Installe yt-dlp via pip dans /usr/local/bin (PATH par défaut)
RUN pip install --no-cache-dir --upgrade yt-dlp

# Vérifie que yt-dlp est bien installé et accessible
RUN yt-dlp --version && which yt-dlp

# Dossier de travail
WORKDIR /app

# Copie et installe les dépendances Node
COPY package*.json ./
RUN npm ci --only=production

# Copie le code
COPY . .

# Expose le port
EXPOSE 3000

# Lance le serveur
CMD ["npm", "start"]
