var db = require('./db');//This makes sure the db registers the models

var mongoose = require('mongoose');
var wAlert = mongoose.model('wAlert');
var Post = mongoose.model('Post');
var ActivePost = mongoose.model('ActivePost');
var ActiveWeatherPost = mongoose.model('ActiveWeatherPost');


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

                        var info = alert.info;
                        var desc = jp.query(info, '$..description');
                        desc += '\nInstructions: \n' + jp.query(info, '$..instruction');
                        var title = jp.query(info, '$..headline');
                        var start = jp.query(info, '$..effective');
                        var end = jp.query(info, '$..expires');

                        var activePost;
                        var activeWeatherPost;
                        if(desc.length > 100){
                          var briefDesc = desc.substring(0, 99);
                          activePost = new ActivePost({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: briefDesc, description: desc, time: start , clickMore: "Click For More Info"});
                          activeWeatherPost = new ActiveWeatherPost({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: briefDesc, description: desc, time: start, clickMore: "Click For More Info"});
                        }
                        else{
                          activePost = new ActivePost({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: desc, time: start});
                          activeWeatherPost = new ActiveWeatherPost({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: desc, time: start});
                        }

                        activePost.save();//add regardless of whether it exists
                        //because the collection is emptied every time
                        activeWeatherPost.save();

                        wAlert.findOne({'AlertID': aId}, function(err, result){
                          //if there isn't already a logged alert then add it to
                          //the logged alerts
                          if(!result){

                            var newWeather;
                            var weatherPost;

                            if(desc.length > 200){
                              var briefDesc = desc.substring(0, 99);
                              newWeather = new wAlert({AlertID: aId, AlertInfo: jsonString});
                              weatherPost = new Post({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: briefDesc, description: desc, time: end, clickMore: "Click For More Info"});
                            }
                            else{
                              newWeather = new wAlert({AlertID: aId, AlertInfo: jsonString});
                              weatherPost = new Post({agency: 'NOAA', imageLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/768px-NOAA_logo.svg.png',title: title, briefDescription: desc, time: end});
                            }

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
