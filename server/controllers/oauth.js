const { users } = require('../models');
const axios = require('axios');
const qs = require('querystring')
const jwtDecode = require('jwt-decode');

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
    githubController : async (req, res)=>{
        const authorizationCode = req.body.authorizationCode;
        const accessToken = await axios.post(`https://github.com/login/oauth/access_token`,
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
                Accept: `application/json`,
                authorization : `token ${accessToken.data.access_token}`
            }
        });
        const {login, email}  = userInfo.data;
        const userName = await users.findOne({
            where : {userName : login}
        })
        console.log('hi')
        if(userName){
            req.session.save(()=>{
                req.session.userId = userName.id;
                console.log(accessToken.data.access_token)
                return res.status(200).send({accessToken : accessToken.data.access_token, message : 'ok'});
            })                
        }else{
            await users.create({
                userName : login , email : email
            })
            req.session.userId = userName.id;
            res.status(200).send({accessToken : accessToken.data.access_token, message : 'ok'}); 
        }
    },

    googleController : async (req, res)=>{
        const requestAccessToken=qs.stringify({
            scope:"profile",
            code:req.body.authorizationCode,
            client_id:googleClientId,
            client_secret:googleClientSecret,
            redirect_uri:"http://localhost:3000",
            grant_type:"authorization_code",
        })
        console.log("requestAccessToken : ",requestAccessToken)
        const accessToken = await axios.post(
            'https://oauth2.googleapis.com/token',
            requestAccessToken,
        {
            headers : { Accept : 'application/json'}
        })
        const {email , name} = jwtDecode(accessToken.data.id_token);
        const checkExisting = await users.findOne({
            where : { email : email , userName : name}
        })
        if(checkExisting){
            req.session.userId = checkExisting.id
            res.send({accessToken : accessToken.data.access_token, message : 'ok'})
        }else{
            req.session.userId = checkExisting.id
            await users.create({
                email : email , userName : name
            })
            res.send({accessToken : accessToken.data.access_token, message : 'ok'})
        }
    }
}