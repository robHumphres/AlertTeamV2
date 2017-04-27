var db = require('./db');//This makes sure the db registers the models

var mongoose = require('mongoose');
var wsdotSoapFunction = require("./wsdotSoapFunction");
var Post = mongoose.model('Post');
var TrafficAlert = mongoose.model('TrafficAlert');


module.exports.trafficAlerts = function(){
  wsdotSoapFunction.getAlertsForSpokaneAreaInCallback(function(result){
    addAlertArray(result, 0);
  });


}//end addArrayToDb

function addAlertArray(array, index){
  if(array.length == index){
    console.log("Ending recursion");
    return;
  }

  var alert;
  alert = new TrafficAlert(array[index]);

  TrafficAlert.findOne({'AlertID': alert.AlertID}, function(err, result){
    if(!result){
      console.log("Alert added");
      alert.save();
      addPost(alert);
    }
    else{
      console.log("Alert already added");
    }
  }).then(addAlertArray(array, index + 1));//recursive call
}//end addAlertArray

function addPost(alert){
  var post = new Post({title: alert.EventCategory, postInfo: alert.HeadlineDescription, time: alert.StartTime});
  post.save();
}//end addAlert
