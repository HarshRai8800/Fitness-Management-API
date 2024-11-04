const zod = require("zod")

const CoachCreation = zod.object(
{
    name:zod.string().min(2),
    password:zod.string().min(6),
    email:zod.string().endsWith("@gmail.com"),
    specialization:zod.string().max(21)
}
)
const ClientCreation=zod.object(
    {
        
    name:zod.string().min(2),
    email:zod.string().endsWith("@gmail.com"),
    phone:zod.number().min(6),
    age:zod.number().min(18).max(30),
    goal:zod.string(),
   
    }
)

const update = zod.object({
    progressNotes:zod.string().max(255),
    lastUpdated:zod.string(),
    weight:zod.number().max(100).min(50),
    bmi:zod.number().max(31).min(18)
})

const ClientDeletion = zod.object({
    id: zod.string().length(24),
});
const ScheduleEmail = zod.object({
    mail: zod.string().email(),
    sub: zod.string().min(1).max(100), 
    msg: zod.string().min(1), 
    day: zod.number().min(1).max(31), 
    month: zod.number().min(1).max(12), 
    year: zod.number().min(new Date().getFullYear()), 
});


module.exports = {CoachCreation,ClientCreation,update,ClientDeletion,ScheduleEmail}