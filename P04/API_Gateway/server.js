const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/albums', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5100/albums');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/albums', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5100/albums', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/playlists', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5400/playlists');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/playlists', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5400/playlists', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/artista', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5200/graphql', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cancion', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5300/graphql', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway on http://localhost:${PORT}`);
});