const jwt = require("jsonwebtoken")
export const jwt_secret = "1234"

const sigup = ({name,email})=>{

if(!(name&&email)){
return false
}
const token = jwt.sign({name:name,enail:email},jwt_secret)

return token

}

module.exports = {sigup}
