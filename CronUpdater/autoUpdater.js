var soap = require('soap');
var url = 'http://www.wsdot.wa.gov/traffic/api/HighwayAlerts/HighwayAlerts.svc';
var CronJob = require('cron').CronJob;
var alertDb = require('./alertDb.js');
var alertDbUtils = require("./alertDbUtil.js");

//this CronJob object is a repeating timer. It performs the function inside it's second
//parameter at the time interval specified in the first
//parameter. The syntax of the time interval of the first parameter
//is in cron form. This one in particular runs
//every 5 seconds. The function itself is getting the DOT
//alerts from Spokane and updating the alertArray with the
//new alerts.
var job = new CronJob('*/5 * * * * *', function() {

    getAlertsForSpokaneAreaInCallback(function(result){
      //using functions from alertPrintUtils it makes the
      //alerts more viewable

      alertArray = result;
      alertDbUtils.addArrayToDb(alertArray);
      //alertArray.forEach(addPostFromAlert);
      alertDbUtils.weatherAlerts();
      console.log("The alerts have been updated!");

    });
  }, null,//this can be replaced with a function that runs at the end
          //of the above function
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);





//creates a soap client to the WSDOT api then gets alerts
//from the Spokane area
////The callback function is where you can use the data
//from the spokane alerts. The data can only be used
//in the callback due to the asynchronous funcionality
//of node js. If you try to return it from the createClient
//function it will not work (thats why the callback is used)
var getAlertsForSpokaneAreaInCallback = function (callback) {
  //creates a soapClient for the url
  soap.createClient(url, function(err, client){
    if(err){
      console.error(err);
    }
    if(typeof client != 'undefined' && client){
      client.GetAlertsForMapArea({AccessCode:'e0b86f9a-d27f-473e-9068-7c15c919df33',MapArea: 'L3SPOWEST'  }, function(err, result, raw, soapHeader){
        //console.log(result.GetAlertsForMapAreaResult.Alert);
        if(err)
        {
          console.error(err);
        }
        if(typeof result != 'undefined' && result){
          callback(result.GetAlertsForMapAreaResult.Alert);
        }
      });
    }
    else{
      console.log("Invalid soap client");
    }
  });
}
