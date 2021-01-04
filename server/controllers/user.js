const { users, copy, Sequelize, userBookmark } = require('../models');

module.exports = {
  userInfoController: async (req, res) => {
    try{
      const checkExisting = await users.findOne({
        where : {id : req.session.userId}
      })
      if(!checkExisting){
        res.status(401).send({message : 'user not exist'});
      }

      let bookmarkCount = await users.findAndCountAll({
        where : {id : req.session.userId},
        attributes : ['id', 'email', 'userName', 'createdAt', 'updatedAt'],
        include : {
          model : copy
        }
      })
      if(bookmarkCount.rows[0].copies.length === 0){
        bookmarkCount.count = 0;
      }
      delete bookmarkCount.rows[0].dataValues.copies
      const postingCount = await copy.findAndCountAll({
        where : {myPostingId : req.session.userId}
      })

      let userInfo = bookmarkCount.rows[0].dataValues
      userInfo.bookmarkCount = bookmarkCount.count;
      userInfo.postingCount = postingCount.count;
      res.send(userInfo)
    }
    catch(err){
      res.status(500).send({ message: "server error" });
    }
  },

  myPostingController: async (req, res) => {
    try {
      const myPostingContents = await copy.findAll({
        attributes : ['title', 'content', 'writer', 'category', 'likeCount', 'id'],
        include: [{
          model : users,
          where : {id : req.session.userId}
        }]
      });
      const result = myPostingContents.map(data=>{
        delete data.dataValues.user
        return data.dataValues
      })
      res.status(200).send({result : result});
    }
    catch (err) {
      res.status(500).send({ message: "server error" });
    }
  },

  bookMarkController: async (req, res) => {

    try{
      const myBookmark = await users.findOne({
        where : {id : req.session.userId},
        include : {
          attributes : ['id', 'title', 'writer', 'likeCount', 'category', 'content'],
          model : copy
        }
      })
      const result = myBookmark.dataValues.copies.map(data=>{
        delete data.dataValues.userBookmark
        return data.dataValues
      })
      res.send({result : result});
    }
    catch(err){
      res.status(500).send({ message: "server error" });
    }

  },
};

