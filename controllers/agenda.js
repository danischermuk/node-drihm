var app          = require('../app');

exports.scheduleEvent = function(appliance, params) {
  console.log("EVENT SCHEDULED");
  console.log(appliance);
  console.log(params);
  app.agenda.schedule(params.when, 'toggle', {ip: appliance.ip, state: 'toggle'});
};


exports.getJobs = function(params) {
	var retJobs;
	console.log("AGENDA GET JOBS LOCAL ------------------");
	app.agenda.jobs({}, function(err, jobs) {
	  console.log("errores " + err);
	  console.log("jobs " + JSON.stringify(jobs));
	  return jobs;
	});	
};