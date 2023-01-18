var verifykit = function(req, res) {
  console.log('verify_kit');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;
  var _id = req.body._id; 
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
      database.UserModel.find({_id:_id},(err,results)=>{
        if(err){
          console.log('verfitkit UserModel.find err');
          output.status=401;
          res.send(output);
          return;
        }
        if(results.length>0){
          if(results[0]._doc.user_id==user_id){
            console.log('verifykit success');
            output.status=100;
            res.send(output);
          }else{
            console.log('verfitkit failed2');
            output.status=200;
            res.send(output);
          }
        }else{
          console.log('verfitkit failed');
          output.status=200;
          res.send(output);
        }
      });
    });  
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.verifykit = verifykit;