const { users, copy, Sequelize } = require('../models');

module.exports = {
  userInfoController: async (req, res) => {
    // -- case : user가 my profile을 눌렀을 때
    // -- {id, username, email, bookmarkCount, postingCount}
    // -- session -email
    // -- userData =
    // select u.id, u.name, u.email, count(mp.bookmark)  from users u
    // inner join mypage mp on u.id = mp.userId
    // inner join copies cp on mp.bookmark = cp.id
    // where u.email = session.email
    // -- user가 posting 한 글들의 수 구하기
    // select count(1) from users u inner join copies cp on u.id = cp.mypostingid
    // where u.id = userData.id
    try { 
      
      if (!req.session.userId) {
        res.status(401).send({message:"존재하지 않는 유저입니다"});
      } else {
        const userInfo = await users.findOne({
          where: {
            email: req.session.userId,
          }, //세션값으로 해당 유저를 찾음
        });
        const mypageInfo = await mypage.findOne({
          where: {
            userId: userInfo.dataValues.id,
          }, //마이페이지에서 해당 유저의 아이디와 일치하는 값을 찾음(연결)
        });
        const bookMarkCount = await copy.findAndCountAll({
          include: [mypage],
          where: {
            id: mypageInfo.dataValues.bookmarkId,
          }, //카피테이블에서 마이페이지의 북마크아이디와 일치하는 값들을 찾고 집계
        });
        const myPostingCount = await copy.findAndCountAll({
          include: [users],
          where: {
            myPostingId: userInfo.dataValues.id,
          }, // 카피테이블에서 유저정보와 일치하는 값들을 찾고 집계
        });
        res.status(200).send({
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          bookmarkCount: bookMarkCount.count,
          postCount: myPostingCount.count,
        });
      }
    } catch (err) {
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
      // FROM copy INNER JOIN users ON copy.myPostingId = copy.id
      console.log({result : result})
      res.status(200).send({result : result});
    }
    catch (err) {
      res.status(500).send({ message: "server error" });
    }
  },

  bookMarkController: async (req, res) => {

    await copy.findAll({
      attributes : ['title', 'content', 'writer', 'category', 'likeCount', 'id'],
      include : [{
        model : users,
        through : {
          
        }
      }]
    })



  },
};

