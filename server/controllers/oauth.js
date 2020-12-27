const { users, copy, mypage } = require('../models');
const axios = require('axios');

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

module.exports = {
    githubController : async (req, res)=>{

        const authorizationCode = req.body.authorizationCode;
        
        axios.post(`https://github.com/login/oauth/access_token`,
        {
            'Content-Type' : 'application/json'
        },
        {
            client_id:clientID,
            client_secret : clientSecret,
            code : authorizationCode
        })
        .then(result => {
            accessToken = result.data.access_token;
            res.status(200).send({accessToken : accessToken, message : 'ok'});
        })
        .catch(err => {
            res.status(404).send({message : 'not found accessToken'});
        })
    },

    googleController : async (req, res)=>{

    }
}