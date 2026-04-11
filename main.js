const express = require('express')
const app = express()
const port = process.env.PORT | 3000;

app.get('/api/hello', (rq, rs) => rs.json({ ok: true }))
app.listen(port, () => console.log("API Listening on", port))
