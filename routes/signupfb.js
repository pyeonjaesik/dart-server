var signupfb = function(req, res) {
  console.log('signup_fb');
  var request = require('request');
  var output={};
  var userToken = req.body.token||0;  
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
      console.log('signupfb: request callback 1');
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
        console.log('signupfb: request callback 2');
        var body_obj= JSON.parse(body);
        var user_id=body_obj.data.user_id;
        output.user_id=user_id;
        database.UserModel.find({user_id:user_id},function(err,results){
          if(err){
            console.log('signupfb: UserModel find err');
            output.status=401;
            res.send(output);
            return;
          }
          if(results.length>0){
            output._id=results[0]._doc._id;
            output.id=results[0]._doc.id;
            if(results[0]._doc.pw==='0'){
              output.pwindex='false';
            }else{
              output.pwindex='true';
            }
            database.CoinModel.find({'_id':output._id},function(err,results){
              if(err){
                console.log('signupfb: CoinModel.find err');
                output.status=420;
                res.send(output);
                return;
              }
              if(results.length>0){
                output.coin=results[0]._doc.coin;
                output.status=200;
                res.send(output);
                console.log('signupfb: already sign up so just login');
              }else{
                console.log('signupfb: CoinModel.find results.length==0 -->err');
                output.status=421;
                res.send(output);
              }
            });
          }else{
            var paramId = user_id;
            var ct=parseInt(Date.now());
            var User = new database.UserModel({'user_id':user_id,'id':user_id,'ct':ct,'type':0});
            User.save(function(err,results){
              if(err){
                console.log('signupfb: User.save err');
                console.log(err);
                output.status=402;
                res.send(output);
                return;
              }
              if(results){
                var rdi = results._doc._id;
                console.log('rdi:'+rdi);
                var tk = new database.TkModel({'_id':rdi,'id':paramId});
                tk.save(function(err){
                  if(err){
                    console.log('tk.save err');
                    output.status=404;
                    res.send(output);
                    return;  
                  }
                  var Lv = new database.LvModel({'_id':rdi});
                  Lv.save(function(err){
                    if(err){
                      console.log('Lv.save err');
                      output.status=405;
                      res.send(output);
                      return;    
                    }
                    console.log('signup success');
                    output._id=rdi;
                    output.id=paramId;
                    var coin = new database.CoinModel({'_id':rdi,'coin':10000});
                    coin.save(function(err){
                      if(err){
                        console.log('coin Model.save err');
                        output.status=406;
                        res.send(output);
                        return;  
                      }
                      var alarm = new database.AlarmModel({'_id':rdi});
                      alarm.save((err)=>{
                        if(err){
                          console.log('signupfb: alarm.save err');
                          output.status=407;
                          res.send(output);
                          return;
                        }
                        output.status = 100;
                        res.send(output);
                      });                                  
                    });                            
                  });                                                              
                });
              }else{
                console.log('signupdb User.save results == null -->err');
                output.status=402;
                res.send(output);
              }
            });
          }
       });
      });
    });  
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.signupfb = signupfb;