const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")

function initialize(passport){
    // function to authenticate users
    const authenticateUsers = async(username, password, done) =>{
        // get user by username
        const user = getUserByUsername(username)
        if(user == null){
            return done(null, false, {message:"The username doesn't exist in our database"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
        } catch (e) {
            console.log(e)
            return done(e)
        }
        passport.use(new LocalStrategy({usernameField:"username"}))
        passport.serializeUser((user, done)=>{})
        passport.serializeUser((id, done)=>{})
    }
}

module.exports = initialize