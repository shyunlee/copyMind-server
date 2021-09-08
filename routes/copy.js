var express = require('express');
var router = express.Router();


const controllers = require('../controllers/copy');



router.post('/getcopy', controllers.getCopyController)
router.post('/postcopy', controllers.postCopyController)
router.post('/addlike', controllers.addLikeController)

router.post('/removelike', controllers.removeLikeController)



module.exports = router;
