//requiring packages
var express=require("express");
var router= express.Router();

//require middleware
var middleware=require("../middleware");

//require Models
var  Patient     =require("../models/patient"),
     Doctor      =require("../models/doctor"),
	 Appointment =require("../models/appointment");

//require sendgrid and dotenv
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

//get apikey from env file
const key = process.env.SENDGRID_KEY;

//get all appointments
router.get("/getAppointment",middleware.isLoggedIn,function(req,res) {
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
	})

});


//get add appointment form
router.get("/addAppointment",middleware.isLoggedIn,middleware.isItUser,function(req,res) {
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
	})
	
});


//appointment post route
router.post("/addAppointment",middleware.isLoggedIn,middleware.isItUser,function(req,res) {

	//get data from the form and add in the obj
	var pname=req.body.pname;
	var areason=req.body.reason;
	var dname=req.body.dname;
	var ddate=req.body.ddate;
	
	var newAppointment={pname:pname,areason:areason,dname:dname,ddate:ddate};

	//before adding the appointment check whether name provided as patient name exist in patient model
	Patient.findOne({pname:pname}, function(err,obj) {
	 //if patient doesnt exist redirect to add patient form
	 if(!obj)
	 {
	 	req.flash("error","No patient with the name "+pname+",add the patient first");
	 	res.redirect("/addPatient");

	 } 
	 //if patient exists already
	 else
	 {
	 	//Create new appointment 
	 	Appointment.create(newAppointment,function(err,newlyAddedApp) 
			{
				if(err)
				{
					console.log(err);
				}
				else
				{	
					//if appointment is created
					req.flash("success","Appointment Details added");
					res.redirect("/getAppointment");

					//create a date type variable with name event
					const event = new Date(ddate);
					var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'2-digit',minute:'2-digit' };
					//set sendgrid api key from .env file
					sgMail.setApiKey(key);

					//email to be sent
					const msg = {
  									to: obj.pemail,
  									from: 'hmsofficial1011@gmail.com',
  									subject: 'Comfirmation mail',
  									text: 'HI '+obj.pname+' your appointment with Doctor Mr.'+dname+' is confirmed for '+areason+" on "+event.toLocaleDateString("en-US",options),
								};

					//send email using sendgrid built-in send fn
					sgMail.send(msg, (error, result) => {
    					if (error)
    					{

      						console.log(error);
    					}
    					else
    					{
     				 		console.log("Email sent sent to "+obj.pemail);
    					}
  					});
				}
			})
	 }

	});
	 
})

router.get("/editAppointment/:id",middleware.isLoggedIn,middleware.isItUser,function(req,res) {
	//find and render appointment details in the editform
	Appointment.findById(req.params.id,function(err,foundApp) 
	{			//find all doctors to insert in dropdown menu
				Doctor.find({},function(err,alldoctors) 
				{
					if(err)
					{
						console.log(err);
					}
					else
					{	
						res.render("appointment/edit",{doctor:alldoctors,appointment:foundApp});
					}
		
				})
			
			
	});
});

router.put("/editAppointment/:id",middleware.isLoggedIn,middleware.isItUser,function(req,res) {
	//take all data from form and insert into variables for including in email
		var pname=req.body.appointment.pname;
		var areason=req.body.appointment.areason;
		var dname=req.body.appointment.dname;
		var ddate=req.body.appointment.ddate;
		//check whether patient exist and take his details
		Patient.findOne({pname:pname}, function(err,obj) 
		{
			if(!obj)
			{
				console.log(err);
			}
			else
			{	console.log("patient successfully found!")
				//find and update the details using id in appointments model
				Appointment.findByIdAndUpdate(req.params.id,req.body.appointment,function(err,updatedAppointment) 
				{
						if(err)
						{
							console.log(err);
						}
						else
						{
							console.log("appointment successfully updated")
							//redirect to get appointment route
							req.flash("success","Appointment Details updated");
							res.redirect("/getAppointment");
							//create a date type variable with name event
							const event = new Date(ddate);
							var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'2-digit',minute:'2-digit' };
							//set sendgrid api key from .env file
							sgMail.setApiKey(key);

							//email to be sent
							const msg = {
  											to: obj.pemail,
  											from: 'hmsofficial1011@gmail.com',
  											subject: 'Appointment details update Comfirmation mail',
  											text: 'HI '+obj.pname+' your updated appointment with Doctor Mr.'+dname+' for '+areason+' is on ' +event.toLocaleDateString("en-US",options),
										};

							//send email using sendgrid built-in fn
							sgMail.send(msg, (error, result) => {
    							if (error)
    							{
      								console.log(error);
    							}
    							else
    							{
     				 				console.log("update email succesfully sent");
     				 			}})

						}
				})
			}
		})


});
		

//delete appointment route
router.delete("/deleteAppointment/:id",middleware.isLoggedIn,middleware.isItUser,function(req,res) {
	//find and delete appointment from appointment model using its id
	Appointment.findByIdAndRemove(req.params.id,function(err) {
		if(err)
		{
			res.redirect("/getAppointment");
		}
		else
		{
			req.flash("success","Appointment Details deleted");
			res.redirect("/getAppointment");

		}
	})
})


module.exports=router;
