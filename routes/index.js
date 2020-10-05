//require package
var express=require("express");
var router= express.Router();
var passport=require("passport");

//require models
var User    =require("../models/user");
var Doctor=require("../models/doctor");
var Patient=require("../models/patient");

//require middleware
var middleware=require("../middleware");


//variables
var DocCount;
var PatCount;

//landing page
router.get("/",function(req,res) {
	// body...
	res.redirect("/login");
});

//panel page
router.get("/panel",middleware.isLoggedIn,function(req,res) {
	Doctor.countDocuments(function (err, count) { 
    if (err){ 
        console.log(err) 
    }
    else
    { 
        DocCount=count;
        console.log("no of dr "+DocCount);
        Patient.countDocuments(function (err, Patcount) { 
    	if (err){ 
        			console.log(err) 
    			}
    		else{ 
        			PatCount=Patcount;
        			console.log("no of pat "+PatCount);
        			res.render("panel",{user:req.user.username,DocCount:DocCount,PatCount:PatCount});
    			} 
		}); 
    } 
	});
	
	
	
})


//show register form
router.get("/register",function(req,res) {
	res.render("register");
	// body...
});

//registeration post route
router.post("/register",function(req,res) {
	//take new user details from add user form
	var newUser = new User({username:req.body.username});
	//register the new user using passport js
	User.register(newUser,req.body.password,function(err,user) {
		if(err)
		{
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function() {
			
			res.send("you got registered");
		});
	});
});






//login routes

//show login form
router.get("/login",function(req,res) {
	res.render("login");
});

//register post route
router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/panel",
	 	failureRedirect:"/login"
	 }),function(req,res) {


	
});


//logout route
router.get("/logout",function(req,res) {
	req.logout();
	res.redirect("/login");
});






module.exports=router;