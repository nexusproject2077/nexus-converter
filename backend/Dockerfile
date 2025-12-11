# Image de base Node.js légère (Alpine pour rapidité)
FROM node:18-alpine

# Installe Python, pip, ffmpeg et git (requis pour yt-dlp)
RUN apk add --no-cache python3 py3-pip ffmpeg git

# Crée un lien pour python (parfois nécessaire)
RUN ln -sf python3 /usr/bin/python

# Installe yt-dlp directement via pip (plus fiable que le wrapper)
RUN pip3 install --no-cache-dir yt-dlp

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers package et installe les dépendances Node
COPY package*.json ./
RUN npm ci --only=production

# Copie le reste du code backend
COPY . .

# Expose le port (Render utilise $PORT, mais on met 3000 par défaut)
EXPOSE 3000

# Lance le serveur
CMD ["npm", "start"]
