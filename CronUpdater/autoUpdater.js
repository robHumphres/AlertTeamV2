var CronJob = require('cron').CronJob;
var trafficFunction = require("./trafficFunction");
var weatherFunction = require("./weatherFunction");

//this CronJob object is a repeating timer. It performs the function inside it's second
//parameter at the time interval specified in the first
//parameter. The syntax of the time interval of the first parameter
//is in cron form. This one in particular runs
//every 5 seconds. The function itself is getting the DOT
//alerts from Spokane and updating the alertArray with the
//new alerts.
var job = new CronJob('*/5 * * * * *', function() {

    trafficFunction.trafficAlerts();
    //alertArray.forEach(addPostFromAlert);
    weatherFunction.weatherAlerts();
    console.log("The alerts have been updated!");


  }, null,//this can be replaced with a function that runs at the end
          //of the above function
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);
