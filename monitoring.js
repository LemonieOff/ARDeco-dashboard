const express = require('express');
const app = express();
const path = require('path');

// Port sur lequel le serveur sera écouté
const port = 3000;

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

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
