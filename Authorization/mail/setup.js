const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:'enter your email',
        pass:'enter your app password'
    }
})
module.exports = transporter
