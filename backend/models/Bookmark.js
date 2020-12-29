const mongoose = require('mongoose');

const BookmarkSchem = new mongoose.Schema({
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

module.exports = mongoose.model('Bookmarks',BookmarkSchem);