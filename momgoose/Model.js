const { update } = require("../InputValidation/Zod")
const mongoose = require("./Mongoos")
const {SchemaClient,SchemaCoach,SchemaAdmin,SchemaProgress,clientProgress} = require("./Schema")


const Coach = mongoose.model("coach",SchemaCoach)

const Client = mongoose.model("Client",SchemaClient)

const Admin = mongoose.model("Admin",SchemaAdmin)  

const Progress = mongoose.model("Progress",SchemaProgress)

const Updating = mongoose.model("update",clientProgress)
module.exports = {
    Coach,Client,Admin,Progress,Updating
}