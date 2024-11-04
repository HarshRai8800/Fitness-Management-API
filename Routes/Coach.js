const  {Router}= require("express")
const Coaches = require("../Routes.Routes.js/Coach")

const route = Router()

route.use("/coaches",Coaches)




module.exports = route