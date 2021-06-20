const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    profileImg: {
        type: String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)