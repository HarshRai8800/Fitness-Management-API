const  {Router}= require("express")
const {Admin,Client,Coach,Updating} = require("../momgoose/Model")
const mongoose = require("mongoose")

const route = Router()

route.get("/admin/dashboard",async(req,res)=>{

const admin = await Admin.find({
    email:req.headers.email,
    password:req.headers.password
})

if(!admin){
    res.status(411).json({
        msg:"invalid admin"
    })
}

const clients = await Client.find({})
console.log(clients)
const Activeclients = await Client.find({
    schedule:true
})
const copaches = await Coach.find({})
console.log(copaches)
const update = await Updating.findOne({id:new mongoose.Types.ObjectId(req.headers.id)})

res.status(200).json({
msg:"succesfull",
numberOfClients:clients.length,
numberOfCoaches:copaches.length,
averageClient: (copaches.length/clients.length),
progressClient:{
    update
}

})




})



module.exports = route