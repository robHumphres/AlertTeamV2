var db = require('./db');//This makes sure the db registers the models

var mongoose = require('mongoose');
var wsdotSoapFunction = require("./wsdotSoapFunction");
var nodemailer = require('nodemailer');

var Post = mongoose.model('Post');
var ActivePost = mongoose.model('ActivePost');
var TrafficAlert = mongoose.model('TrafficAlert');
var ActiveTrafficPost = mongoose.model('ActiveTrafficPost');
var User = mongoose.model('User');
var Email = require('./emailFunction');
var newAlerts = false;

module.exports.trafficAlerts = function(){

  newAlerts = false;
  wsdotSoapFunction.getAlertsForSpokaneAreaInCallback(function(result){
    addAlertArray(result, 0, newAlerts, Email.sendEmail);
  });

  //console.log("lsdfjsdlfjsdlfjsdflsdj");
}//end addArrayToDb

function addAlertArray(array, index, isNew, callback){
  if(array.length == index){
    console.log("Ending recursion");

    if(isNew == true){
      callback("New Traffic Alerts");
    }
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
      isNew = true;
      console.log("Alert added");
      alert.save();
      addPost(alert);
    }
    else{
      console.log("Alert already added");
    }
    addAlertArray(array, index + 1, isNew, callback);
  });//recursive call
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
