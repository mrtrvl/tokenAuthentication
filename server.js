const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

let jwt = require('jsonwebtoken');
let config = require('./config');
let User = require('./app/models/userModel')

const port = 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send(`Hello! The api is running at http://localhost:${port}/api`);
});

/* app.get('/setup', (req, res) => {
    let mrt = new User({
        name: 'Mrt',
        password: 'mrt',
        admin: true
    });

    mrt.save((err) => {
        if (err) throw err;
        console.log(`User saved successfully`);
        res.json({ success: true});
    });
}); */

let apiRoutes = express.Router();

apiRoutes.post('/authenticate', (req, res) => {
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: `Authentication failed. User ${req.body.name} not found!` });
        } else if (user) {
            if (user.password != req.body.password) {
                res.json( { success: false, message: 'Authentication failed. Wrong password!' });
            } else {
                const payload = {
                    admin: user.admin
                };

                let token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 60*60*24 //24 hours in seconds
                });

                res.json({
                    success: true,
                    message: 'Enjoy Your token!',
                    token: token
                });
            }
        }
    });
});

apiRoutes.use((req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, app.get('superSecret'), (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token!' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send( {
            success: false,
            message: 'No token provided'
        });
    }
});

apiRoutes.get('/', (req, res) => {
    res.json('Welcome to API');
});

apiRoutes.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

app.listen(port);
console.log(`Magic happening at http://localhost:${port}`);
