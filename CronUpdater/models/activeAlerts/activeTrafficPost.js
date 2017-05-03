var mongoose = require('mongoose');

var activeTrafficPostSchema = mongoose.Schema({
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('ActiveTrafficPost', activeTrafficPostSchema);
