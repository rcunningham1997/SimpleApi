FROM node:18
COPY package*.json ./
COPY main.js ./
RUN npm ci --omit=dev
ENV PORT=3000
EXPOSE 3000
CMD ["node", "main.js"]
