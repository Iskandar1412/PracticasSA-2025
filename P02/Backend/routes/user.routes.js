const express = require('express');
const { autenticar } = require('../middleware/auth.middleware');
const { getUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', autenticar, getUser);


module.exports = router;