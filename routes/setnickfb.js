var setnickfb = function(req, res) {
  console.log('setnick_fb');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;
  var nick = req.body.nick||0;  
  var clientId = '307735940108008';
  var clientSecret = '67a581ab2eb991714dd9dfd274ab794d'
  var appLink = 'https://graph.facebook.com/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
	var database = req.app.get('database');
	if (database.db) {
    request(appLink, function (error, response, body) {
      if(error){
        console.log('signupfb: request1 err detected');
        output.status=1001;
        res.send(output);
        return;
      }
      var body_obj= JSON.parse(body);
      var appToken = body_obj.access_token;
      var link = 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken;
      request(link,function(error, response, body){
        if(error){
          console.log('signupfb: request2 err detected');
          output.status=1002;
          res.send(output);
          return;
        }
        var body_obj= JSON.parse(body);
        console.dir(body_obj)
        var user_id=body_obj.data.user_id;
        database.UserModel.where({'user_id':user_id}).update({'id':nick},function(err){
          if(err){
            console.log('setnick_fb UserModel.update err');
            output.status=1003;
            res.send(output);
            return;
          }
          output.status=100;
          res.send(output);
        });
      });
    });  
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.setnickfb = setnickfb;