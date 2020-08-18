const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const request = require('request');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index',{
        siteKey: process.env.SITE_KEY
    });
});

app.post('/captcha', (req, res) => {
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({responseError: "Something went wrong"});
    }
    const secretKey = process.env.SECRET_KEY
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

    request(verificationURL, (error, respose, body) => {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.json({"responseError": "Failed captcha verification", body, verificationURL})
        }
        res.json({"responseSuccess": "Success"})
    })

})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})