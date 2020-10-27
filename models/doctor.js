var mongoose = require("mongoose");

var DoctorSchema=mongoose.Schema({
	dname:{type:String,unique:true},
	dage:Number,
	specialization:String
});


module.exports=mongoose.model("Doctor",DoctorSchema);