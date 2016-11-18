const express = require('express');
const router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    // userProperty: 'payload'
});

const ctrlAuth = require('../controllers/authentication');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/secure', auth, function(req, res) {
    res.json(req.user);
});


module.exports = router;