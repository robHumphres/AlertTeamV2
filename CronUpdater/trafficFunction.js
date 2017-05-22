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
      callback("traffic");
    }
    return;
  }


  var alert;
  var activeAlert;
  alert = new TrafficAlert(array[index]);
  addActivePosts(alert);//add regardless of whether it exists
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

function addActivePosts(alert){
  var activeTrafficPost;
  var activePost;

  if(alert.HeadlineDescription.length > 200){//if its too big
    var brief = alert.HeadlineDescription.substring(0, 99);
    activePost = new ActivePost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: brief, description: alert.HeadlineDescription, time: alert.StartTime, clickMore: "Click For More Info"});
    activeTrafficPost = new ActiveTrafficPost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: brief, description: alert.HeadlineDescription, time: alert.StartTime, clickMore: "Click For More Info"});
  }
  else{
    activePost = new ActivePost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: alert.HeadlineDescription, time: alert.StartTime});
    activeTrafficPost = new ActiveTrafficPost({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: alert.HeadlineDescription, time: alert.StartTime});
  }
  activeTrafficPost.save();
  activePost.save();
}

function addPost(alert){
  var post;

  if(alert.HeadlineDescription.length > 100){
    var brief = alert.HeadlineDescription.substring(0, 99);
    post = new Post({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: brief, description: alert.HeadlineDescription, time: alert.StartTime, clickMore: "Click For More Info"});
  }
  else{
    post = new Post({agency: 'WSDOT', imageLink: 'http://4vector.com/i/free-vector-wsdot-0_075021_wsdot-0.png',title: alert.EventCategory, briefDescription: alert.HeadlineDescription, time: alert.StartTime});
  }

  post.save();
}//end addAlert
