const { Double } = require('mongodb');
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4
    },
    author: {
        type: String,
        required: true,
        min: 4
    },
    category: {
        type: String,
        required: true,
        min: 3
    },
    rating: {
        type: Number,
        default: 5
    },
    paid: {
        type: Boolean,
        default: false
    },
    price: {
     type: Number,
     default: 0.0
    }
    
})

module.exports = mongoose.model('books',BookSchema)