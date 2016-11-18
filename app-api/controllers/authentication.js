const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


const sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) { 
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, { message: 'All fields are required' });
        return;
    }

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save((err) => {
        let token;
        if (err) {
            sendJSONResponse(res, 400, err);
            return;
        } else {
            token = user.generateJwt();
            sendJSONResponse(res, 200, { token: token });
        }
    });
};

module.exports.login = function (req, res) { 
    if (!req.body.email || !req.body.password) {
        sendJSONResponse(res, 404, { message: 'All fields are required' });
        return;
    }

    passport.authenticate('local', (err, user, info) => {
        let token;

        if (err) {
            sendJSONResponse(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            sendJSONResponse(res, 200, { token: token });
        } else {
            sendJSONResponse(res, 401, info);
        }

    })(req, res);
};