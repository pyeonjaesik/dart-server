var signup = function(req, res) {
    console.log('signup');
    var xss = require("xss");   
	var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var output={};
  var er=0;  
  for (var i=0; i<paramId.length; i++)  {
    var chk = paramId.substring(i,i+1); 
    if(!chk.match(/[a-z]|[A-Z]|[0-9]/)) { 
      er = er + 1; 
    } 
  } 
  if (er > 0) {
    console.log('not valid info');
    output.status=800;
    res.send(output);
    return;
  }
  if(paramId.length<1||paramId.length>13){
    console.log('not valid info11');
    output.status=800;
    res.send(output)    
    return;  
  }
  if(paramPassword.length<6||paramPassword.length>20){
    console.log('not valid info55');
    output.status=800;
    res.send(output)    
    return;      
  }
    paramId=xss(paramId);
    paramPassword=xss(paramPassword);
    var k_r= new RegExp('script','i');
    var sc_i=paramId.search(k_r);
    if(sc_i!=-1){
      output.status=700;    
      res.send(output);
      return;    
    }
    var sc_i2=paramPassword.search(k_r);
    if(sc_i2!=-1){
      output.status=701;    
      res.send(output);
      return;    
    }    
    var time = parseInt(Date.now());
    var td = parseInt(Date.now()/1800000);
	var database = req.app.get('database');
	if (database.db) {
		addUser(database, paramId, paramPassword, function(err, addedUser) {
			if (err) {
                console.error('사용자 추가 중 에러 발생 : ' + err.stack);
                output.status = 2;
                res.send(output);
                
                return;
            }
			if (addedUser) {
				database.UserModel.find({id:paramId},function(err,results){
                    if(err){
                        console.log('회원가입이 모두 되었으나 userinfo의 위한 _id 찾기를 실패하였습니다.');
                        output.status = 401;
                        res.send(output);
                        return;
                    }
                    if(results.length>0){
                        var rdi = results[0]._doc._id;
                        var tk = new database.TkModel({'_id':rdi,'id':paramId});
                        tk.save(function(err){
                          if(err){
                            console.log('tk.save err');
                            output.status=404;
                            res.send(output);
                            return;  
                          }
                          var Lv = new database.LvModel({'_id':rdi,'id':paramId});
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
                            var coin = new database.CoinModel({'_id':rdi,'id':paramId});
                            coin.save(function(err){
                              if(err){
                                console.log('coin Model.save err');
                                output.status=406;
                                res.send(output);
                                return;  
                              }
                              output.status = 1;
                              res.send(output);                                  
                            });                            
                          });                                                              
                        });
                    }else{
                        console.log('user_schema 의 id중 paramId 인 것을 찾으려고했지만 아무것도 검색되지 않는다.');
                        output.status = 403;
                        res.send(output);
                    }
                    
                });

			} else {
                output.status = 3;
                res.send(output);
			}
		});
	} else {
        output.status =4;
        res.send(output);
	}
	
};
var addUser = function(database, id, password, callback) {
    var ct=parseInt(Date.now());
	var user = new database.UserModel({"id":id, "password":password,"ct":ct});
	user.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
	    callback(null, user);
	});
}
module.exports.signup = signup;