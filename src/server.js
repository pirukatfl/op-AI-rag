import app from './app.js'
import router from './routes/routes.js'
import express from 'express'
import fs from 'fs'
import https from 'https'

app.use(express.json())
app.use('/', router)
const port = 3000

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
    ca: fs.readFileSync('./server.crt'),
};

function initialize() {
    https.createServer(options, app).listen(port, () => {
        console.log(`Example app listening on port https://localhost:${port}`)
    })
}

export default initialize