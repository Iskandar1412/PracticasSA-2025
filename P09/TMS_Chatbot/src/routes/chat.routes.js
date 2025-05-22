const express = require('express');
// const { isAuthUser } = require('../middleware/auth.middleware');
const { chatDeepseek } = require('../controllers/chat.controller');

const router = express.Router();

// GET
// router.get('/chat', obtenerChat)

// POST
// router.post('/chat', chatFunction)
router.post('/deep', chatDeepseek)

module.exports = router