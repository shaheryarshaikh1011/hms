//requiring packages
var express=require("express");
var router= express.Router();

//require middleware
var middleware=require("../middleware");

//require Models
var Patient=require("../models/patient"),
     Doctor=require("../models/doctor"),
Appointment=require("../models/appointment");

//require sendgrid and dotenv
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

//get apikey from env file
const key = process.env.SENDGRID_KEY;

//get all appointments
router.get("/getAppointment",function(req,res) {
	//get all appointments from appointment model and send to appointment/show
	Appointment.find({},function(err,allappointments) {
		if(err)
		{
			console.log(err);
		}
		else
		{

			res.render("appointment/show",{appointments:allappointments});
		}
		// body...
	})

});


//get add appointment form
router.get("/addAppointment",function(req,res) {
	//send list of doctors to appointment form frm doctor model
	Doctor.find({},function(err,alldoctors) {
		if(err)
		{
			console.log(err);
		}
		else
		{	
			res.render("appointment/new",{doctor:alldoctors});
		}
		// body...
	})
	
});


//appointment post route
router.post("/addAppointment",middleware.isLoggedIn,function(req,res) {

	//get data from the form and add in the obj
	var pname=req.body.pname;
	var areason=req.body.reason;
	var dname=req.body.dname;
	var ddate=req.body.ddate
	
	var newAppointment={pname:pname,areason:areason,dname:dname,ddate:ddate};

	//before adding the appointment check whether name provided as patient name exist in patient model
	Patient.findOne({pname:pname}, function(err,obj) {
	 console.log(obj);
	 //if patient doesnt exist redirect to add patient form
	 if(!obj)
	 {
	 	console.log("no patient");
	 	res.redirect("/addPatient");
	 } 
	 //if patient exists already
	 else
	 {
	 	console.log(obj);
	 	//Create new appointment 
	 	Appointment.create(newAppointment,function(err,newlyAddedApp) 
			{
			// body...if(err)
				if(err)
				{
					console.log(err);
				}
				else
				{	
					
					res.redirect("/getAppointment");
					const event = new Date(ddate);

					//if appointment is created use sgmail to send confirmation email
					var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'2-digit',minute:'2-digit' };
					sgMail.setApiKey(key);


					const msg = {
  									to: obj.pemail,
  									from: 'hmsofficial1011@gmail.com',
  									subject: 'Comfirmation mail',
  									text: 'your appointment with Doctor '+dname+' is confirmed for '+areason+" on "+event.toLocaleDateString("en-US",options),
								};
					sgMail.send(msg, (error, result) => {
    					if (error)
    					{
      						console.log(error);
    					}
    					else
    					{
     				 		console.log("Email sent");
    					}
  					});
				}
			})
	 }

	});
	 
})

router.get("/editAppointment/:id",function(req,res) {
	Appointment.findById(req.params.id,function(err,foundApp) 
	{
				Doctor.find({},function(err,alldoctors) {
				if(err)
				{
				console.log(err);
				}
				else
				{	
				res.render("appointment/edit",{doctor:alldoctors,appointment:foundApp});
				}
		// body...
				})
			
			
	});
});

router.put("/editAppointment/:id",function(req,res) {
	//find and update
		var pname=req.body.appointment.pname;
		var areason=req.body.appointment.areason;
		var dname=req.body.appointment.dname;
		var ddate=req.body.appointment.ddate;
		Patient.findOne({pname:pname}, function(err,obj) 
		{
			if(!obj)
			{
				console.log(err);
			}
			else
			{	console.log("patient found")
				Appointment.findByIdAndUpdate(req.params.id,req.body.appointment,function(err,updatedAppointment) 
				{
						if(err)
						{
							console.log(err);
						}
						else
						{
							console.log("appointment updated")
							res.redirect("/getAppointment");
							const event = new Date(ddate);
							var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'2-digit',minute:'2-digit' };
							sgMail.setApiKey(key);


							const msg = {
  											to: obj.pemail,
  											from: 'hmsofficial1011@gmail.com',
  											subject: 'Appointment details update Comfirmation mail',
  											text: 'your appointment is updated with Doctor '+dname+' for '+areason+' is on ' +event.toLocaleDateString("en-US",options),
										};
							sgMail.send(msg, (error, result) => {
    							if (error)
    							{
      								console.log(error);
    							}
    							else
    							{
     				 				console.log("update email sent");
     				 			}})

						}
				})
			}
		})


});
		

//delete appointment route
router.delete("/deleteAppointment/:id",function(req,res) {
	Appointment.findByIdAndRemove(req.params.id,function(err) {
		if(err)
		{
			res.redirect("/getAppointment");
		// body...
		}
		else
		{
			res.redirect("/getAppointment");

		}
	})
})


module.exports=router;
