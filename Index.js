const express = require("express")
const client = require("./Routes/Client")
const Coach = require("./Routes/Coach")
const bodyParser = require("body-parser")
const admin = require("./Routes/Admin")
const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use("/api",client)

app.use("/api",Coach)
app.use("/api",admin)
const port = 3019
app.listen(port,()=>{
console.log("listening on port " + port)


})
