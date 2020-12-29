const { Double } = require('mongodb');
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

})

module.exports = mongoose.model('reviews',ReviewSchema)