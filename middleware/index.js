var middlewareObj={}

//check whether is there anyone logged in?
middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports=middlewareObj;

//check whether is it user
middlewareObj.isItUser=function(req,res,next){
	if(req.user.username!=="admin")
	{
		//if he is not admin then proceed
		return next();
		
	}
	//else if he is admin redirect to panel
	res.redirect("/panel");
}

//check whether is it Admin
middlewareObj.isItAdmin=function(req,res,next){
	if(req.user.username=="admin")
	{
		//if he is admin then proceed
		return next();
	}
	//else if he is not admin redirect to panel
	res.redirect("/panel");
}