var mongoose = require('mongoose');

var trafficAlertSchema = mongoose.Schema({
    AlertID: String,
    EndRoadwayLocation:{
      Description: String,
      Direction: String,
      Latitude: String,
      Longitude: String,
      MilePost: String
    },
    EndTime: Date,
    EventCategory: String,
    EvenStatus: String,
    ExtendedDescription: String,
    HeadlineDescription: String,
    LastUpdatedTime: Date,
    Priority: String,
    Region: String,
    StartRoadwayLocation:{
      Description: String,
      Direction: String,
      Latitude: String,
      Longitude: String,
      MilePost: String
    },
    StartTime: Date
});

mongoose.model('TrafficAlert', trafficAlertSchema);
