const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/statistics.html'));
});

app.get('/ticket/:ticketId', (req, res) => {
    const ticketId = req.params.ticketId;
    res.sendFile(path.join(__dirname, 'public/ticketChat.html'));
});

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ardeco.app",
        "https://api.ardeco.app",
        "https://support.ardeco.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});