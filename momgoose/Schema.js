const { schedule } = require("node-cron");
const mongoose = require("./Mongoos");
const { boolean } = require("zod");


const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const SchemaCoach = new mongoose.Schema({

    name:{
      type:String,
      required:true,
      minlength:2

    },
    email:{
    type:String,
    required:true,
  match:[emailRegex, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
        unique:true,
        minlength:6
    },
    specialization:{
        type:String,
        enum:["intern","pro","senior","manager"],
        default:"intern"
    }
})

const SchemaClient=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2
  
      },
      email:{
      type:String,
      required:true,
    match:[emailRegex, 'Please fill a valid email address']
      },
      phone:{
          type:Number,
          required:true,
          unique:true,
          length:10
      },
      age:{
        type:Number,
        minlength:18,
        maxlength:30
      },
      goal:{
   type:String,
      required:true

      },
      coachId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"coach"
      },
      schedule:{
        type:Boolean,
        default:false
      }



})

const SchemaAdmin = new mongoose.Schema({

    name:{
      type:String,
      required:true,
      minlength:2

    },
    email:{
    type:String,
    required:true,
  match:[emailRegex, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
        unique:true,
        minlength:6
    }
})

const SchemaProgress = new mongoose.Schema({
  progressNotes:{
    type:String,
    default:""
  },
  lastUpdated:{
    type:String,
    default:Date.now().toString()
  },
  weight:{
    type:Number,
    default:65
  },
  bmi:{
    type:Number,
    default:0
  },
  client:{
type:mongoose.Schema.Types.ObjectId,
ref:"Client",
required:true
  },
 coach:{
  type:mongoose.Schema.Types.ObjectId,
 ref:"coach",
 required:true
   }
 })

 const clientProgress =new mongoose.Schema({
  id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Client"
  },
  weight:{
    type:Number,
    default:0
  },
  bmi:{
    type:Number,
    default:0
  }
 })

module.exports={
    SchemaClient,SchemaCoach,SchemaAdmin,SchemaProgress,clientProgress
}