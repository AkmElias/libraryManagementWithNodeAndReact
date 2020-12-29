const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    Email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    Role: {
        type: String,
        default: 'user',
    },
    Password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('users',UserSchema)