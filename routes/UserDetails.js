const express = require("express")
const router = express.Router()
const UserDetailsController = require("../controllers/UserDetails")
const { validateUserRegistration, validateUserSignIn,userValidation } = require("../middleware/validation/UserDetails")
const { isAuth } = require("../middleware/validation/Auth")

router.get("/login",UserDetailsController.User_Login_Page)
router.get("/register",UserDetailsController.User_Register_Page)
router.post("/register",validateUserRegistration, userValidation,UserDetailsController.User_Register_User)
router.post("/login",validateUserSignIn, userValidation, UserDetailsController.User_Login_User)
router.get("/redirect",UserDetailsController.User_Redirect_Page)
router.get("/user", (req,res)=>{
    res.send("Secret mode")
})
router.get("/", isAuth, (req,res)=>{
    res.render("index")
})

module.exports = router