var mongoose = require("mongoose");

var PatientSchema=mongoose.Schema({
	pname:{type:String,unique:true},
	page:{type:Number},
	pemail:String,
	pgender:String,
	paddr:String
});


module.exports=mongoose.model("Patient",PatientSchema);