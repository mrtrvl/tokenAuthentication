const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');
let config = require('./config');
let User = require('./app/models/userModel')

const port = 8080;
mongoose.connect(config.database);
//app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send(`Hello! The api is running at http://localhost:${port}/api`);
});

app.get('/setup', (req, res) => {
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
});

app.listen(port);
console.log(`Magic happening at http://localhost:${port}`);
