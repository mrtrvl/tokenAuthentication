let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.Schema('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));