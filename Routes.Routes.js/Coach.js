const  {Router}= require("express")
const { Admin,Coach, Client }= require( "../momgoose/Model")
const { CoachCreation } = require( "../InputValidation/Zod")
const { default: mongoose } = require("mongoose")
const route = Router()

route.post("/",async(req,res)=>{

const check =await Admin.find({
    email:req.headers.email,
    password:req.headers.password
})
console.log(check)
if(check[0]==null){
    return res.status(411).json({
        msgt:"admin not found"
    })
}
console.log(check)
if(!CoachCreation.safeParse(req.body)){
    return res.status(411).json({
        msgt:"data not valid"
    })
}

try {
    const coach = await Coach.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        specialization:req.body.specialization
    })
    if(coach){
        return res.status(200).json({
    
            msg:"coach created succesfully"
        })
    }else{
        return res.status(500).json({
            msg:"internal server error"
        })
    }
} catch (error) {
    return res.status(400).json({
        msg:"coach already exists"
    })
    
}

})


route.get("/:coachid/clients",async (req,res)=> {
    const find = await Coach.findOne({_id:req.params("coachid")})
    console.log(find)
    if(!find){
      return  res.status(411).json({
            msg:"coach not found"
        })
    }
const clients = await Client.find({
    _id:mongoose.Types.ObjectId(req.params("coachid"))
})
console.log(clients)
if(!clients){
  return res.status(500).json({
        msg:"internal server error"
    })
}
return res.status(200).json({
    clients
})
})

module.exports = route