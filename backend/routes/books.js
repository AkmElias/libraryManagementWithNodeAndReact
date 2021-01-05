const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const verify = require('../verifytoken');

const booksController = require('../controllers/bookController')

router.get('/',booksController.getBooks);
router.post('/addbook',verify,booksController.addBook);
router.patch('/:bookId', verify,booksController.editBook);
router.delete('/:bookId',verify, booksController.deleteBook);
router.post('/reviews/:bookId', verify, booksController.addReview);
router.get('/reviews/:bookId',verify,booksController.viewBook);
router.post('/bookmark/:bookId',verify,booksController.bookmark);
router.post('/payment',verify,booksController.payment);

module.exports = router;