// third-party package and default package imports
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors")
const UserDetailsRoutes = require("./routes/UserDetails");
const app = express();


mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=>{
        console.log("connected")
        app.listen(process.env.APP_PORT)
    })
    .catch((err)=>{
        console.log("error connecting to database")
        console.log(err)
    });

//middleware and static files
app.set("view engine", "ejs")
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use("/auth",UserDetailsRoutes)

app.get("/", (req,res)=>{
    res.render("index")
})

app.use((req,res)=>{
    res.status(404).render("404",{title:"Page Not Found"})
})
