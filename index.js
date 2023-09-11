const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")


const port = process.env.PORT


const app = express()

//middleware;
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

//database connection;


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
}).then(() => console.log("database connected"))
    .catch((err) => console.log(err))
    

app.use("/", require("./Routes/authRoutes"))


app.listen(port, () => console.log(`connected to port ${port}`))

