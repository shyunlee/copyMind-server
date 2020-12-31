const { users, copy, Sequelize } = require('../models');
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
        console.log(req.body, req.session.userId)
        const checkBookmark = await userBookmark.findOne({
            where : { [Op.and] : [
                {bookmarkId : req.body.id},
                {userId : req.session.userId}
            ]}
        })
        if(checkBookmark){
            res.status(404).send({message : 'exist bookmark'});
        }
        await userBookmark.create({
            userId : req.session.userId,
            bookmarkId : req.body.id
        })
        res.send({message : 'like success'});
    },
    removeLikeController : async (req, res)=>{
    }
}