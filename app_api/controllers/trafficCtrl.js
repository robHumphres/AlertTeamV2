var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var alert;

module.exports.addAlertToDb = function(req, res){

  var array = Post.find({},function(err, result){
    res.send(result);
  });
}
