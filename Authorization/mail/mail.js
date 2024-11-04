const transporter = require("./setup")

async function sendMail(to,sub,msg){
 const mail = await transporter.sendMail({
    to:to,
    subject:sub,
    html:msg
 })
 console.log(mail)
if(mail){
    return true
}
else{
    return false
}
}
module.exports = sendMail
