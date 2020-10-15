var middlewareObj={}

//check whether is there anyone logged in?
middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports=middlewareObj;


middlewareObj.isItUser=function(req,res,next){
	console.log(req.user.username);
	if(req.user.username!=="admin")
	{
		return next();
		
	}
	res.redirect("/panel");
}

middlewareObj.isItAdmin=function(req,res,next){
	console.log(req.user.username);
	if(req.user.username=="admin")
	{
		return next();
	}
	res.redirect("/panel");
}