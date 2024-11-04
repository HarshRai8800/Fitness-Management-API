const  {Router}= require("express")
const Clients = require("../Routes.Routes.js/Clients")

const route = Router()

route.use("/client",Clients)




module.exports = route