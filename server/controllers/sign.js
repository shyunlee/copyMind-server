const {users} = require('../models/index');

module.exports = {
    signInController : async (req, res)=>{
        try {
            const {Email , Password} = req.body
            const checkExist = await users.findOne(
                {where :{email : Email, password : Password}}
            );
            if(!checkExist){
                res.status(401).send({message : 'user not found'});
            };
            req.session.userId = Email
            res.send({message : 'ok'});
        }
        catch(err){
            res.status(500).send({message : "server error"});
        }
    },

    signUpController : async (req, res)=>{
        try {
            const {Email, Password, Name} =req.body;
            const checkExist = await users.findOne(
                {where : {email : Email}}
            );
            if(checkExist){
                return res.status(409).send({message : '이미 존재하는 이메일입니다'});
            };
            await users.create(
                {email : Email, password : Password, userName : Name}
            );
            // return res.redirect('http://localhost:3000');
            return res.send({message : 'signup seccess!'});
        }
        catch(err){
            return res.status(500).send({message : 'server error'})
        }
    },

    logoutController : async (req, res)=>{
        try {
            if(!req.session.userId){
                res.status(400).send({message : `you're not currently login`});
            }
            req.session.destroy();
            res.send({message : 'sucessfully log-out!'});
        }
        catch(err){
            res.status(500).send({message : 'server error'});
        }
    }
}