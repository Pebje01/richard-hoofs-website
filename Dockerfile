FROM node:20-alpine

# Git + SSH nodig voor CMS auto-sync naar GitHub
RUN apk add --no-cache git openssh-client ca-certificates \
 && mkdir -p /root/.ssh \
 && chmod 700 /root/.ssh \
 && ssh-keyscan -t rsa,ed25519 github.com >> /root/.ssh/known_hosts 2>/dev/null

WORKDIR /app

# Dependencies eerst (betere Docker cache)
COPY package*.json ./
RUN npm install --omit=dev

# Projectbestanden kopiëren
COPY . .

# Backups map aanmaken
RUN mkdir -p cms/backups

EXPOSE 3000

CMD ["node", "server.js"]
