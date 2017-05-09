var mongoose = require('mongoose');

var activeWeatherPostSchema = mongoose.Schema({
    agency: String,
    imageLink: String,
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('ActiveWeatherPost', activeWeatherPostSchema);
