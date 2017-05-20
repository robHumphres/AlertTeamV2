var mongoose = require('mongoose');
var ActivePost = mongoose.model('ActivePost');
var User = mongoose.model('User');

module.exports.getAllPosts = function(req, res){

  var curUser = User.findOne({'email': req.body.email}, function(err, result){
    if(!result){
      console.log('No filter');
      var array = ActivePost.find({},function(err, result){
        res.send(result);
      });
    }
    else{
      console.log('Filtering: ' + result.filter);
      var filterArray = [];
      result.filter.forEach(function(fil){
        if(fil == "weather")
          filterArray.push("NWS");
        if(fil == "traffic")
          filterArray.push("WSDOT");
      });
      var array = ActivePost.find({"agency": filterArray},function(err, result){
        res.send(result);
      });
    }
  });
}
