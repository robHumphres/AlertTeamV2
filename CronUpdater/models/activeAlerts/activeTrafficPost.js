var mongoose = require('mongoose');

var activeTrafficPostSchema = mongoose.Schema({
    agency: String,
    imageLink: String,
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('ActiveTrafficPost', activeTrafficPostSchema);
