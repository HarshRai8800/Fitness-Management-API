const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:'harshrai8800@gmail.com',
        pass:'kzotggsnggfqkhph'
    }
})
module.exports = transporter