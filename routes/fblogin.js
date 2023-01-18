var fblogin = function(req,res){
  console.log('fblogin');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;
  console.log('userToken:'+userToken);
  var clientId = '2220881804668342';
  var clientSecret = '8f190731fa5003c887f31c445a8ac88c'
  var appLink = 'https://graph.facebook.com/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
  console.log('appLink:'+appLink);
  // var appToken = request.get(appLink).json()['access_token'];
  
  request(appLink, function (error, response, body) {
   console.log('error:', error); // Print the error if one occurred
   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
   console.log('body:', body); // Print the HTML for the Google homepage.
   var body_obj= JSON.parse(body);
   var appToken = body_obj.access_token;
   console.log(`appToken:${appToken}`);
   var link = 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken;
   console.log('link: '+link);
   request(link,function(error, response,body){
     console.log('body:',body);
     res.send(output);
   });
});
};
module.exports.fblogin = fblogin;