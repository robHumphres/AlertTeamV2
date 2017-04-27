var soap = require('soap');
var url = 'http://www.wsdot.wa.gov/traffic/api/HighwayAlerts/HighwayAlerts.svc';


//creates a soap client to the WSDOT api then gets alerts
//from the Spokane area
////The callback function is where you can use the data
//from the spokane alerts. The data can only be used
//in the callback due to the asynchronous funcionality
//of node js. If you try to return it from the createClient
//function it will not work (thats why the callback is used)
module.exports.getAlertsForSpokaneAreaInCallback = function (callback) {
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
