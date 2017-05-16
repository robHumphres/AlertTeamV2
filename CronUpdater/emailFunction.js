var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var User = mongoose.model('User');

module.exports.sendEmail = function(text){

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'alertSystem.do.not.reply@gmail.com',
          pass: 'mangoisnotthenameofthedb'
      }
    });

    User.find({},function(err, result){
      for(var i = 0; i < result.length; i++){
        var mailOptions = {
          from: 'alertSystem.do.not.reply@gmail.com', // sender address
          to: result[i].email, // list of receivers
          subject: 'New Alerts', // Subject line
          text: text, // plain text body
          html: '<h>New alerts have been registered</h><br /><a href="http://localhost:3000">localhost:3000</a>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
      }
    });
}
