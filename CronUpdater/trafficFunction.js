var db = require('./db');//This makes sure the db registers the models

var mongoose = require('mongoose');
var wsdotSoapFunction = require("./wsdotSoapFunction");
var nodemailer = require('nodemailer');

var Post = mongoose.model('Post');
var ActivePost = mongoose.model('ActivePost');
var TrafficAlert = mongoose.model('TrafficAlert');
var ActiveTrafficPost = mongoose.model('ActiveTrafficPost');
var User = mongoose.model('User');

var newAlerts = false;

module.exports.trafficAlerts = function(){
  wsdotSoapFunction.getAlertsForSpokaneAreaInCallback(function(result){
    addAlertArray(result, 0);
  });

  //console.log("lsdfjsdlfjsdlfjsdflsdj");
  if(newAlerts == true){

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'alertSystem.do.not.reply@gmail.com',
          pass: 'mangoisnotthenameofthedb'
      }
    });

    User.find({},function(err, result){
      for(var i = 0; i < result.length; i++){
        console.log(result[i].email.type);
        var mailOptions = {
          from: 'alertSystem.do.not.reply@gmail.com', // sender address
          to: result[i].email, // list of receivers
          subject: 'New Alerts', // Subject line
          text: 'Hello world ?', // plain text body
          html: '<b>Hello world ?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
      }
    });

  }


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
      newAlerts = true;
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
