var mongoose = require('mongoose');
var alertDb = require("./alertDb.js");
var collectionName = 'alerts';
var wCollectionName = 'wAlerts';
var Post = mongoose.model('Post');
var wAlert = mongoose.model('wAlert');

module.exports.addArrayToDb = function(array){
  if(alertDb.readyState === 1){
    addAlertArray(array, 0);
  }
  else{
    console.log("Alert database is not open. Cannot add alerts.");
  }
}//end addArrayToDb

function addAlertArray(array, index){
  if(array.length == index){
    console.log("Ending recursion");
    return;
  }

  searchDbForAlert(array[index].AlertID, collectionName)
  .then(function (result){
      if(result.length == 0){//array is empty, meaning the alert doesn't exist in the db
        addAlert(array[index]);
      }
      else{
        console.log("Alert has already been entered");
      }
      addAlertArray(array, index + 1);//recursive call
      },
      function(err){
        console.error(err);
  });
}//end addAlertArray

function addAlert(data){
  console.log("Alert added");
  alertDb.collection(collectionName).insert(data);
  console.log(data.EventCategory);
  var post = new Post({title: data.EventCategory, postInfo: data.HeadlineDescription, time: data.StartTime});
  console.log(post);
  post.save();
}//end addAlert

function searchDbForAlert (dataID, collectionName) {
  return new Promise(function (resolve, reject) {
    alertDb.collection(collectionName).find({'AlertID': dataID}, function (err, result) {
      if (err) return reject(err) // rejects the promise with `err` as the reason
      resolve(result.toArray())   // fulfills the promise with `data` as the value

    })
  })
}//end searchDbForAlert

// //this was the previous method used before promises
// //Its a little harder to understand
// db.collection(str).find({"AlertID": array[index].AlertID},
//   function (err, result){
//     result.toArray(
//       function(err, arg1){
//         if(arg1.length == 0){
//           console.log("Alert added");
//           db.collection(str).insert(array[index]);
//         }
//         else{
//           console.log("Alert has already been entered");
//         }
//         addAlertArray(db, array, str, index + 1, callback);
//   });
// });

//Weather

module.exports.weatherAlerts = function(){
  console.log("Updating Weather Alerts");
  var https = require('https');
	//Washington
	//url = 'https://alerts.weather.gov/cap/wa.php?x=0';
	//Idaho
	//url = 'https://alerts.weather.gov/cap/id.php?x=1';
  //Spokane
  //url = 'https://alerts.weather.gov/cap/wwaatmget.php?x=WAC063&y=1'

  var urlArray = ['https://alerts.weather.gov/cap/id.php?x=1',
                  'https://alerts.weather.gov/cap/wa.php?x=0'];
  var i;
  for(i = 0; i < urlArray.length; i++){
    var url = urlArray[i];

    var opts = require('url').parse(url);
    opts.headers ={
  	  'User-Agent': 'javascript'
  	};


    https.get(opts, (res) => {
  		//console.log('statusCode:', res.statusCode);
      var data = ' ';

  		res.on('data', (d) => {
  				data += d;

  		});//End of res.data
      res.on('end', () =>{

  				//First convert to json
  				var parseString = require('xml2js').parseString;
  				parseString(data, function(err, result){

  					var jsonString = JSON.stringify(result);
  					jsonString.trim(' ');
            var jsonObj = JSON.parse(jsonString);
  					var jp = require('jsonpath');

  					//Get the list of alerts.
  					var alertList = jp.query(jsonObj, '$.feed.entry');
  					var ids = jp.query(alertList, '$..id');

            //this gets set to false in following if statement when
            //there are no active weather alerts for the region.
            var flag = true;
            //If there is only 1 alert, it is possible it is the "no alerts" entry.
            if(ids.length == 1){
              var titles = jp.query(alertList, '$..title');
              var fTitle = JSON.stringify(titles[0]);
              fTitle = fTitle.replace('[\"', '');
  						fTitle = fTitle.replace('\"]', '');
              if(fTitle === 'There are no active watches, warnings or advisories'){
                flag = false;
              }//End of set flag.
            }//End of Check for active alerts

            //Only proceed if active alerts exist.
            if(flag){
    					var x = 0;
    					for(;x < ids.length; x++ ){
    						//Get alert.
    						var urlAlert = JSON.stringify(ids[x]);

    						//Strip out extra structure
    						urlAlert = urlAlert.replace('[\"', '');
    						urlAlert = urlAlert.replace('\"]', '');

    						//Now we have a url to follow for a specific alert.
    						var opts2 = require('url').parse(urlAlert);
    						opts2.headers ={
    							'User-Agent': 'javascript'
    						};

    						https.get(opts2, (res) => {
    							var alertData = ' ';

    							res.on('data', (d) =>{
    								alertData += d;
    							});//End of res.data

    							res.on('end', () =>{
    								if(res.statusCode == '200'){
    									parseString(alertData, function(err, result){

    										var jsonString = JSON.stringify(result);
    										jsonString.trim(' ');

    										var jsonObj = JSON.parse(jsonString);
    										var alert = jsonObj.alert;

                        //Get ID and then search DB for existing alert.
                        var aId = jp.query(jsonObj, '$..identifier') + '';
                        aId = aId.replace('[\"', '');
            						aId = aId.replace('\"]', '');


                        searchDbForAlert(aId, wCollectionName)
                        .then(function (result){

                          if(result.length === 0){
                            //If not found, proceed to insert new alert.
        										var info = alert.info;
        										var desc = jp.query(info, '$..description');
                            desc += '\nInstructions: \n' + jp.query(info, '$..instruction');
        										var title = jp.query(info, '$..headline');
                            var start = jp.query(info, '$..effective');
                            var end = jp.query(info, '$..expires');

                            var newWeather = new wAlert({AlertID: aId, AlertInfo: jsonString});
                            var weatherPost = new Post({title: title, postInfo: desc, time: end});
                            newWeather.save();
                            weatherPost.save();

                            console.log('inserting new alert');
                          }
                          //Else do nothing.
                          else {
                            console.log('weather alert already exists');
                          }
                        });//End of "find" callback.
    										//console.log('ID:   ' + aId);
                        //console.log("Alert: " + title);
    										//console.log(desc);
    									});//End of parsestring
    								}
    							});//End of res.end
    						}).on('error', (e) => {
    							console.log('Error on data');
    							console.error(e);
    						});
    					}//End of each alert for loop.
            }//End of if there are active alerts.
          });//End of parsestring

      });//End of res.end

    }).on('error', (e) => {
      console.log('Error on data');
      console.error(e);
    });
  }
};
