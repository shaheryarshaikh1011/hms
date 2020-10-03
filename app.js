//Packages
var express 	   = require("express"),
    app    		   = express(),
    bodyParser     =require("body-parser"),
    mongoose       =require("mongoose"),
    passport       =require("passport"),
    LocalStrategy  =require("passport-local"),
      sgMail       = require('@sendgrid/mail'),
    methodOverride =require("method-override");

//models 
var User    =require("./models/user"),
    Doctor  =require("./models/doctor"),
    Patient =require("./models/patient");

//routes
var indexRoutes		=require("./routes/index"),
    docRoutes 		=require("./routes/doctor"),
    patRoutes		=require("./routes/patient"),
    appointRoutes	=require("./routes/appointment");

//required to use env file
require('dotenv').config();



//using public directory and method override package
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//mongoose configuration
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.localDB,function(err) {
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("we are connected")
	}
	// body...
});

//using bodyparser and setting view engine as ejs
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");



//passport configuration
var secret=process.env.SECRET_KEY;
app.use(require("express-session")({
	secret:secret,
	resave: false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using passport local for getting currentuser details
app.use(function(req,res,next) {
	res.locals.currentUser=req.user;
	next();
});

//host and port no
const port = process.env.PORT_NO;
const host = process.env.HOSTNAME;

//requiring routes
app.use(indexRoutes);
app.use(docRoutes);
app.use(patRoutes);
app.use(appointRoutes);









app.listen(port,host,function() {
	// body...
	console.log("Listening to port "+port);
	console.log(host+ " has Started");

});