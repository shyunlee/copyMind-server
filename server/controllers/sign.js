
const {users} = require('../models/index');
const { Op } = require("sequelize");
const crypto = require('crypto');

module.exports = {
    signInController : async (req, res)=>{
        try {
            const {email , password} = req.body

            const hashPassword = crypto.createHash('sha512')
            .update(password)
            .digest('hex')

            const checkExist = await users.findOne(
                {where :{email : email, password : hashPassword}}
            );

            if(!checkExist){
                res.status(401).send({message : 'user not found'});
            };

            req.session.userId = checkExist.id;
            res.send({message : 'ok'});
        }
        catch(err){
            res.status(500).send({message : "server error"});
        }
    },

    signUpController : async (req, res)=>{
        try {
            const {email, password, userName} =req.body;

            const hashPassword = crypto.createHash('sha512')
            .update(password)
            .digest('hex')

            //email   userName 구분
            const checkEmail = await users.findOne(
                {where : {email : email}
                }
            );
            const checkUserName = await users.findOne(
                {where : {userName : userName}
                }
            );

            if(checkEmail){
                return res.status(409).send({message : 'same email'}); 
            };

            if(checkUserName){
                return res.status(409).send({message : 'same userName'}); 
            };

            await users.create(
                {email : email, password : hashPassword, userName : userName}
            );

            return res.send({message : 'signup success!'});
        }
        catch(err){
            return res.status(500).send({message : 'server error'})
        }
    },

    signoutController : async (req, res)=>{
        try {
            if(!req.session.userId){
                res.status(400).send({message : `you're not currently login`});
            }

            req.session.destroy();
            res.send({message : 'successfully log-out!'});
        }
        catch(err){
            res.status(500).send({message : 'server error'});
        }
    }
}