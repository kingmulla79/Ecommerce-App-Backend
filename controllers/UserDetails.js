require("dotenv").config()
const UserDetails = require("../models/UserDetails")
const jwt = require("jsonwebtoken")

const User_Login_Page = (req,res)=> {
    res.render("login")
}

const User_Register_Page = (req,res)=>{
    res.render("register")
}

const User_Register_User = async (req,res)=>{
    try{
        const isNewUser = await UserDetails.isThisUsernameInUse(req.body.username);
        if(!isNewUser) return res.render("redirect",{message:"A user with this username already exists"});

        const isNewEmail = await UserDetails.isThisEmailInUse(req.body.email);
        if(!isNewEmail) return res.render("redirect",{message:"A user with this email already exists"});
        const userDetails = new UserDetails({
            username:req.body.username,
            phone:req.body.phone,
            email:req.body.email,
            password: req.body.password
        });
        userDetails.save()
            .then((result)=>{
                console.log("Successfully registered")
                res.redirect("/auth/login")
            })
            .catch((err)=>{
                console.log(err)
                res.send("Error in registration.Try again")
            })
    }
    catch(e){
        console.log(e)
    }
}

const User_Login_User = async (req,res)=>{
    try{
        const saved_user = await UserDetails.findOne({username: req.body.username})
        const result = await saved_user.comparePassword(req.body.password)
        if(result){
            const token = jwt.sign({user_id: saved_user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            res.redirect("/auth/user")
            // res.header("authorization",`${token}`).redirect("/auth/user")
            // res.json({token})
        }
        else{
            res.redirect("/auth/login")
        }
    }
    catch(e){
        console.log(e)
    }
}

module.exports = {
    User_Login_Page,
    User_Register_Page,
    User_Register_User,
    User_Login_User
}