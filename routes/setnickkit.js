var setnickkit = function(req, res) {
  console.log('setnick_kit');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;
  var nick = req.body.nick||0; 
  console.log('usertoken:'+userToken);
  var appLink = 'https://graph.accountkit.com/v1.0/me/?access_token=' + userToken;
	var database = req.app.get('database');
	if (database.db) {
    request(appLink, function (error, response, body) {
      if(error){
        console.log('signupkit: request2 err detected');
        output.status=1002;
        res.send(output);
        return;
      }
      var body_obj= JSON.parse(body);
      var user_id=body_obj.id;
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
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.setnickkit = setnickkit;