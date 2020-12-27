var express = require('express');
var router = express.Router();
const controllers = require('../controllers/sign');

router.post('/signin', controllers.signInController)
router.post('/signup', controllers.signUpController)
router.post('/logout', controllers.logoutController)


module.exports = router;
