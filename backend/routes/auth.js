const express = require('express')
const router = express.Router()

const User = require('../models/User')
const verify = require('../verifytoken');

const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/googlelogin',userController.googleLogin);
router.get('/:userId', verify, userController.getUser);
router.patch('/:userId', verify, userController.editUser);
router.delete('/:userId', verify, userController.deleteUser);
router.get('/', verify, userController.getUsers)


module.exports = router;
