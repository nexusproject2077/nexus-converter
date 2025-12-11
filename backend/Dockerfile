# Base Node.js Alpine (léger et rapide)
FROM node:18-alpine

# Installe les dépendances système
RUN apk add --no-cache python3 py3-pip ffmpeg git curl

# Liens essentiels pour python/pip
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip

# Ajoute /usr/local/bin au PATH (fix principal pour yt-dlp)
ENV PATH="/usr/local/bin:${PATH}"

# Installe yt-dlp globalement
RUN pip install --no-cache-dir --upgrade yt-dlp

# Vérifie l'installation (tu verras ça dans les logs Render build)
RUN yt-dlp --version && which yt-dlp

# Dossier de travail
WORKDIR /app

# Installe dépendances Node
COPY package*.json ./
RUN npm ci --only=production

# Copie le code
COPY . .

# Port
EXPOSE 3000

# Démarre
CMD ["npm", "start"]
