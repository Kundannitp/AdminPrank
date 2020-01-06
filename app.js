
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Ourlittlesecret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://Kundan2000:Kundan2000@@k2j-ebqyx.mongodb.net/SacWeb3", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBD5rbTPGCg2KSI_BTdO5p4IssW8JhNwr8",
    authDomain: "trialsih.firebaseapp.com",
    databaseURL: "https://trialsih.firebaseio.com",
    projectId: "trialsih",
    storageBucket: "trialsih.appspot.com",
    messagingSenderId: "703993460993",
    appId: "1:703993460993:web:6114c8beffda5c733f8300"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function writeUserData(req,res) {
    var regno=req.body.regno;
    
    var OtpString=Math.floor(Math.random() * (1000000 - 100000) + 100000);

    firebase.database().ref('otps/'+regno).set(
        OtpString
    ,
        function (error) {
        });
    
    //SendEmailToUser(OtpString, req.body.email);


    responsemsg = "Otp sent to " + req.body.email;
    res.redirect("/");
}


/*****************************Send Email To User**********************/

function SendEmailToUser(OtpString,email){



}

/*****************************Send Email TO user Ends******************/

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

var proimgsrc = "Images/SacLogo.jpg";
var personname = "Anonymous";
var responsemsg=" ";

app.get("/", function (req, res) {
    
    if (req.isAuthenticated()) {
        res.render("sendOtp",{responemsg:responsemsg});
    } else {
        res.render("login",{loginFirst:"login First"});
    }

});

app.post('/',function(req,res){
    writeUserData(req,res);
});

app.get("/login",function(req,res){
    res.render("login",{loginFirst:" "});
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        }
    });

});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});