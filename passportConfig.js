const LocalStrategy = require("passport-local").Strategy;
const {User} = require('./dbConnection');
const bcrypt = require("bcryptjs");

exports.initializingPassport = (passport) => {

    passport.use('local-register', new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({username});
            if (user) return done(null, false, {message: "Email already Registered"});
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                password: hashedPassword,
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            console.log(error)
            return done(error, false);
        }
    }))


    //Middleware for Login
    passport.use('local-login', new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({username});
            if(!user) return done(null, false);
            const passwordMatch = await bcrypt.compare(password, user.password);
            // if(user.password !== password) return done(null, false);
        
            if(passwordMatch){
                return done(null, user);
            } 
            else{
                return done(null, false);
            }  
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    }) 
    passport.deserializeUser(async(id, done) =>{
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};