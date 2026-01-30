# Image de base
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY AUTH-E2E/package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du projet
COPY AUTH-E2E/ .

# Installer Playwright (si nécessaire à l'exécution)
RUN npx playwright install --with-deps

# Commande par défaut
CMD ["npm", "run", "test:e2e"]
