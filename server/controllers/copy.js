const { users, copy, mypage, Sequelize, sequelize } = require('../models');
const { Op } = require("sequelize");

module.exports = {
    getCopyController : async (req, res)=>{
        const userCount = await copy.count({
            where : {id : 
                {[Op.gt]:0}
            }
        })
        if(req.session.userId){
            if(req.body.pathName === 'view'){
                try {
                    const randomContent = await copy.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    res.send({ return : [randomContent] })
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{
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
        }else if(!req.session.userId && !req.session.nonMember){
            if(req.body.pathName === 'view'){
                try{
                    const limit= Math.floor(Math.random() * userCount) -10;
                    if(limit < 0){
                        limit = 0;
                    }
                    req.session.nonMember = limit;
                    const limitContent = await copy.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { id :
                            {
                                [Op.gte] : limitContent,
                                [Op.et] : limitContent+10
                            } 
                        },
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    res.json({result : [limitContent]})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{
                try {
                    const limit = req.session.nonMember
                    const limitContent = await copy.findAll({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { 
                            [Op.and] : [
                                {category : req.body.pathName},
                                { id : {[Op.gte]: limit, [Op.et] : limit+10} }
                            ]
                        },
                    })
                    res.json({result : [limitContent]})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }
        }
    },

    postCopyController : async (req, res)=>{
        console.log(req.body.writer);
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

    addLikeController : async (req, res)=>{
        try{
            await mypage.create({
                bookmarkId : req.body.id, 
                userId : req.session.userId
            });
            res.json({message : 'like success!'})
        }
        catch(err){
            res.status(500).send({message : 'server err'});
        }
    },

    removeLikeController : async (req, res)=>{
        try {
            await mypage.destroy({
                where : {
                    bookmarkId : req.body.id
                }
            })
            res.json({message : 'remove success!'})
        }
        catch(err){
            res.status(500).send({message : 'server err'});
        }
    }

}