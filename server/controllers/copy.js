const { users, copy, Sequelize, userBookmark } = require('../models');
const { Op } = require("sequelize");

module.exports = {
    getCopyController : async (req, res)=>{
        if(req.session.userId){ //회원
            if(req.body.pathName === 'view'){ //today`s copy 버튼
                try {
                    const randomContent = await copy.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    res.send({ result : [randomContent] })
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{ // 메뉴 버튼
                try {
                    const content = await copy.findAll({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : {
                            category : {
                                [Op.eq] : req.body.pathName
                            }
                        },
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 20,
                    });
                    res.json({result : content});
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }   
        }else if(!req.session.userId){ // 비회원
            if(req.body.pathName === 'view'){
                try{
                    const limitContent = await copy.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { id :
                            {
                                [Op.lt] : 20,
                                [Op.gt] : 0,
                            } 
                        },
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    console.log({result : [limitContent.dataValues]})
                    res.json({result : [limitContent.dataValues]})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{
                try {
                    const limitContent = await copy.findAll({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { 
                            [Op.and] : [
                                {category : req.body.pathName},
                                { id : 
                                    {
                                        [Op.gt]: 0, 
                                        [Op.lt] :10 
                                    } 
                                }
                            ]
                        },
                    })
                    const result = limitContent.map(data=>{
                        return data.dataValues;
                    })
                    res.json({result : result})
                    console.log({result : result})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }
        }
    },

    postCopyController : async (req, res)=>{
        try{
            const userId = await users.findOne({
                attributes : ['id'],
                where : {
                    id : {
                        [Op.eq] : req.session.userId 
                    }
                }
            })
            const resultPost = await copy.create({
                myPostingId : userId.id,
                title : req.body.title,
                writer : req.body.writer,
                content : req.body.content,
                category : req.body.category
            })
            res.send({result : [resultPost]})
        }
        catch(err){
            res.status(500).send({message : 'server err'});
        }
    },

    addLikeController: async (req, res) => {
        console.log('addlike', req.body)
        try {
          await userBookmark.create({
            userId: req.session.userId,
            bookmarkId: req.body.id,
          });
            await copy.update(
              { likeCount: Sequelize.literal("likeCount + 1") },
              { where: { id: req.body.id } }
            );
          const addlikeCount = await copy.findOne({
            attributes: ["likeCount"],
            where: {
              id: req.body.id,
            },
          });
          res.status(200).send({
            message: "like success!",
            likeCount: `${addlikeCount.likeCount}`,
          });
        } catch (err) {
          res.status(500).send({ messsage: "server err" });
        }
    },

    removeLikeController: async (req, res) => {
        console.log('remove like', req.body)
        try {
          await userBookmark.destroy({
            where: {
              userId: req.session.userId,
              bookmarkId: req.body.id,
            },
          });
            await copy.update(
              { likeCount: Sequelize.literal("likeCount - 1") },
              { where: { id : req.body.id } }
            );
          const subtractlikeCount = await copy.findOne({
            attributes: ["likeCount"],
            where: {
              id: req.body.id,
            },
          });
          res.status(200).send({
              message: "remove success",
              likeCount: `${subtractlikeCount.likeCount}`,
            });
        } catch (err) {
          res.status(500).send({ message: "server err" });
        }
      },
}