var mongoose = require('mongoose');

var activePostSchema = mongoose.Schema({
    agency: String,
    imageLink: String,
    title: String,
    briefDescription: String,
    description: String,
    time: Date
});

mongoose.model('ActivePost', activePostSchema);
