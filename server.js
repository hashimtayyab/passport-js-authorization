const express = require("express");
const app = express();
const { connectMongoose, User} =  require("./dbConnection");
const passport = require("passport");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const {initializingPassport} = require("./passportConfig");
const expressSession = require("express-session");
connectMongoose();
app.set('view engine', 'ejs');
initializingPassport(passport);
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized :false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate("local-login", {
    failureRedirect:"/register",
     successRedirect:"/profile"
}));

app.post('/register', (req, res, next) => {
    passport.authenticate("local-register", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).json({ message: "Registration successful!" });
        });
    })(req, res, next);
});

// app.post('/register', async (req, res) => {
    // const user = await User.findOne( { username: req.body.username } );
    // if(user) return res.status(400).send("User already exists");
    // const newUser = await User.create(req.body);
    // res.status(201).send(newUser);
// });

app.get('/profile', (req, res) => {
    res.send(req.user);
})

app.listen(3000, () => console.log("Listening on PORT:3000"));