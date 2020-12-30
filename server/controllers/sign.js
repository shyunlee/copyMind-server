
const {users, copy} = require('../models/index');
const { Op } = require("sequelize");

module.exports = {
    signInController : async (req, res)=>{
        try {
            const {email , password} = req.body
            const checkExist = await users.findOne(
                {where :{email : email, password : password}}
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
            console.log(req.body);
            const {email, password, userName} =req.body;
            const checkExist = await users.findOne(
                {where : {email : email}}
            );
            if(checkExist){
                return res.status(409).send({message : '이미 존재하는 이메일입니다'});
            };
            await users.create(
                {email : email, password : password, userName : userName}
            );
            // return res.redirect('http://localhost:3000');
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