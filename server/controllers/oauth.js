const { users, copy, mypage } = require('../models');
const axios = require('axios');

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
    githubController : async (req, res)=>{

        const authorizationCode = req.body.authorizationCode;
        
        axios.post(`https://github.com/login/oauth/access_token`,
        {
            client_id:githubClientID,
            client_secret : githubClientSecret,
            code : authorizationCode
        },
        {
            headers : {'Content-Type' : 'application/json'}
        }
        )
        .then(result => {
            accessToken = result.data.access_token;
            res.status(200).send({accessToken : accessToken, message : 'ok'});
        })
        .catch(err => {
            res.status(404).send({message : 'not found accessToken'});
        })
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