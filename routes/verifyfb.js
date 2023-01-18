var verifyfb = function(req, res) {
  console.log('verify_fb');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;
  var _id = req.body._id;
  var clientId = '307735940108008';
  var clientSecret = '67a581ab2eb991714dd9dfd274ab794d'
  var appLink = 'https://graph.facebook.com/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
	var database = req.app.get('database');
	if (database.db) {
    request(appLink, function (error, response, body) {
      if(error){
        console.log('verifyfb: request1 err detected');
        output.status=1001;
        res.send(output);
        return;
      }
      var body_obj= JSON.parse(body);
      var appToken = body_obj.access_token;
      var link = 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken;
      request(link,function(error, response, body){
        if(error){
          console.log('verifyfb: request2 err detected');
          output.status=1002;
          res.send(output);
          return;
        }
        var body_obj= JSON.parse(body);
        var user_id=body_obj.data.user_id;
        database.UserModel.find({_id:_id},(err,results)=>{
          if(err){
            console.log('verifyfb err1');
            output.status=401;
            res.send(output);
            return;
          }
          if(results.length>0){
            if(results[0]._doc.user_id==user_id){
              console.log('verifyfb success');
              output.status=100;
              res.send(output);
            }else{
              console.log('verifyfb failed2');
              output.status=200;
              res.send(output);
            }
          }else{
            console.log('verifyfb failed');
            output.status=200;
            res.send(output);
          }
        });
      });
    });  
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.verifyfb = verifyfb;