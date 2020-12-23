var express = require('express');
var router = express.Router();

router.get('/test', function(req, res, next) {
  res.status(200).send({message : 'get'})
});

router.post('/test', (req,res)=>{
  console.log(req.body)
  res.status(200).send({message : 'post'})
})


module.exports = router;
