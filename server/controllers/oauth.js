const { users, copy, mypage } = require('../models');
const axios = require('axios');

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
    githubController : async (req, res)=>{
        const authorizationCode = req.body.authorizationCode;
        console.log(authorizationCode)
        const accessToken = await axios.post('https://github.com/login/oauth/access_token',
        {
            client_id:githubClientID,
            client_secret : githubClientSecret,
            code : authorizationCode
        },
        {
            headers : {Accept : 'application/json'}
        }
        )
        const userInfo = await axios.get('https://api.github.com/user',{
            headers :{
                Accept: 'application/json',
                authorization : `token ${accessToken.data.access_token}`
            }
        });
        const {login, email}  = userInfo.data;
        console.log(login, email)
        const userName = await users.findOne({
            where : {userName : login}
        })
        console.log(userName)
        if(userName){
            req.session.save(()=>{
                req.session.userId = userName.id;
                console.log(accessToken.data.access_token)
                res.status(200).send({accessToken : accessToken.data.access_token, message : 'ok'});
            })
        }else{
            console.log('work')

            await users.create({
                userName : login , email: email
            })
            req.session.userId = userName.id;
            res.status(200).send({accessToken : accessToken.data.access_token, message : 'ok'});
        }
    },

    googleController : async (req, res)=>{
        axios.post(`https://oauth2.googleapis.com/oauth2/v4/token`,
        {
            client_id : googleClientId,
            client_secret : googleClientSecret,
            redirect_uri : `http://copymind.s3-website.ap-northeast-2.amazonaws.com`,
            grant_type : req.body.authorizationCode
        },
        {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
        })
        .then(result =>{
            accessToken = result.data.access_token;
            res.status(200).send({accessToken: accessToken, message : 'ok'})
        })
        .catch(err=>{
            res.status(400).send({message : 'not fount accessToken'});
        })
    }
}