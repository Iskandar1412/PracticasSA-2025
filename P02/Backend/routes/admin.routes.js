const express = require('express');
const { autenticar, isAdmin } = require('../middleware/auth.middleware');
const { getAdmin } = require('../controllers/admin.controller');

const router = express.Router();


router.get('/profile', autenticar, isAdmin, getAdmin);


module.exports = router;