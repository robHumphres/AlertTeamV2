var db = require('./db');//This makes sure the db registers the models

var mongoose = require('mongoose');
var wsdotSoapFunction = require("./wsdotSoapFunction");

var Post = mongoose.model('Post');
var ActivePost = mongoose.model('ActivePost');
var TrafficAlert = mongoose.model('TrafficAlert');
var ActiveTrafficPost = mongoose.model('ActiveTrafficPost');

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
  var activeAlert;
  alert = new TrafficAlert(array[index]);
  addActiveTrafficPost(alert);
  addActivePost(alert);//add regardless of whether it exists
  //because the collection is emptied every time

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

function addActiveTrafficPost(alert){
  var activeTrafficPost = new ActiveTrafficPost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, postInfo: alert.HeadlineDescription, time: alert.StartTime});
  activeTrafficPost.save();
}

function addActivePost(alert){
  var activePost = new ActivePost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, postInfo: alert.HeadlineDescription, time: alert.StartTime});
  activePost.save();
}

function addPost(alert){
  var post = new Post({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, postInfo: alert.HeadlineDescription, time: alert.StartTime});
  post.save();
}//end addAlert
