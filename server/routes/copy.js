var express = require('express');
var router = express.Router();
const controllers = require('./controllers.copy');

router.get('/getcopy', controllers.getCopyController)
router.post('/postcopy', controllers.postCopyController)
router.post('/addlike', controllers.addLikeController)

module.exports = router;
