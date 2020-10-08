//Packages
var express 	   = require("express"),
    app    		   = express(),
    bodyParser     =require("body-parser"),
    mongoose       =require("mongoose"),
    passport       =require("passport"),
    LocalStrategy  =require("passport-local"),
    sgMail         =require('@sendgrid/mail'),
    methodOverride =require("method-override"),
    flash          =require("connect-flash");
//models 
var User        =require("./models/user"),
    Doctor      =require("./models/doctor"),
    Patient     =require("./models/patient");
    Appointment =require("./models/appointment");

//routes
var indexRoutes		=require("./routes/index"),
    docRoutes 		=require("./routes/doctor"),
    patRoutes		=require("./routes/patient"),
    appointRoutes	=require("./routes/appointment");

//required to use env file
require('dotenv').config();



//using public directory for stylesheets
app.use(express.static(__dirname + "/public"));
//use method override for put and delete routes
app.use(methodOverride("_method"));

//mongoose configuration
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.localDB,function(err) {
	if(err)
	{
		//if connection fails
		console.log(err);
	}
	else
	{
		console.log("we are connected to "+process.env.localDB);
	}
	// body...
});

app.use(flash());


//use body parser to get value from ejs forms
app.use(bodyParser.urlencoded({extended:true}));

//set ejs as view engine
app.set("view engine","ejs");



//Session Configuration
var secret=process.env.SECRET_KEY;
app.use(require("express-session")({
	secret:secret,
	resave: false,
	saveUninitialized:false
}));

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using passport local for getting currentuser details
app.use(function(req,res,next) {
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//stating host and port no
const port = process.env.PORT_NO;
const host = process.env.HOSTNAME;

//requiring routes
app.use(indexRoutes);
app.use(docRoutes);
app.use(patRoutes);
app.use(appointRoutes);








//server listen
app.listen(port,host,function() {
	// body...
	console.log("Listening to port "+port);
	console.log(host+ " has Started");

});