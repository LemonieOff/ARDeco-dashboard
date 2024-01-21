const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // Require the cors package

// Port sur lequel le serveur sera écouté
const port = 3001;

// Servir des fichiers statiques (votre HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
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

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});