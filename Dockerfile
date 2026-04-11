FROM node:18
RUN npm ci --only=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "main.js"]
