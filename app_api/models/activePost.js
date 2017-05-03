var mongoose = require('mongoose');

var activePostSchema = mongoose.Schema({
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('ActivePost', activePostSchema);
