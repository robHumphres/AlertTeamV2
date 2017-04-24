var mongoose = require('mongoose');
var wAlert = mongoose.model('wAlert');

module.exports.create = function(req, res){
    console.log("Updating Weather Alerts");
    var https = require('https');
  	//Washington
  	//url = 'https://alerts.weather.gov/cap/wa.php?x=0';
  	//Idaho
  	var url = 'https://alerts.weather.gov/cap/id.php?x=1';

  	var opts = require('url').parse(url);
  	opts.headers ={
  	  'User-Agent': 'javascript'
  	};


    https.get(opts, (res) => {
  		console.log('statusCode:', res.statusCode);
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
            //console.log('JSON:  ' + jsonString);
            var jsonObj = JSON.parse(jsonString);
  					var jp = require('jsonpath');

  					//Get the list of alerts.
  					var alertList = jp.query(jsonObj, '$.feed.entry');
  					var ids = jp.query(alertList, '$..id');


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

  										var info = alert.info;
  										var desc = jp.query(info, '$..description');
  										var title = jp.query(info, '$..event');
  										var aId = jp.query(jsonObj, '$..identifier');
  										console.log('ID:   ' + aId);
                      console.log("Alert: " + title);
  										console.log(desc);

  										var newWeather = new wAlert({alertID: aId, alertInfo: jsonString});
  										newWeather.save();
  									});//End of parsestring
  								}
  							});//End of res.end
  						}).on('error', (e) => {
  							console.log('Error on data');
  							console.error(e);
  						});
  					}//End of each alert for loop.
          });//End of parsestring

      });//End of res.end

    }).on('error', (e) => {
      console.log('Error on data');
      console.error(e);
    });
};
