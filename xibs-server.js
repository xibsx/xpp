const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const connectDB = require('./database');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

let server = require('./qr'),
    code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/qr', server);
app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html')
});
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════╗
║          XIBS Server             ║
║    Running on http://localhost:${PORT}  ║
╚══════════════════════════════════╝
🌟 Don't Forget To Give Star To My Repo 🌟`);
});

module.exports = app;