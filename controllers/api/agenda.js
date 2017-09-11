var app = require('../../app');



// Create endpoint /api/jobs/ for GET
exports.getJobsAPI = function(req, res) {
  app.agenda.jobs({}, function(err, jobs) {
	  res.json(jobs);
	});
};

