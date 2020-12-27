var express = require('express');
var router = express.Router();
const controllers = require('../controllers/oauth');

router.post('/github', controllers.githubController)
router.post('/google', controllers.googleController)

module.exports = router;
