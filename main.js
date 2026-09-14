const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || 'secret-api-key';

const authenticate = (rq, rs, next) => {
  const authHeader = rq.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : rq.headers['x-api-key'];

  if (!token || token !== apiKey) {
    return rs.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
};

app.get('/api/hello', authenticate, (rq, rs) => rs.json({ ok: true }))
app.listen(port, () => console.log("API Listening on", port))
