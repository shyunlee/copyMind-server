const express = require('express');
const router = express.Router();

const controllers = require('../controllers/user');

router.get('/userinfo', controllers.userInfoController)
router.get('/myposting', controllers.myPostingController)
router.get('/bookmark', controllers.bookMarkController)


module.exports = router;

