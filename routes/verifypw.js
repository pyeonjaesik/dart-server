var verifypw = function(req, res) {
  console.log('verifypw');
  var crypto = require('crypto');
  var output={};
  var PW = req.body.pw||0;
  var _id = req.body._id;
	var database = req.app.get('database');
	if (database.db) {
    database.UserModel.find({_id:_id},async function(err,results){
      if(err){
        console.log('verifypw: err');
        output.status=401;
        res.send(output);
        return;
      }
      if(results.length>0){
        
        var salt = results[0]._doc.salt;
        console.log(`salt: ${salt} pw: ${PW}`);
        var encryptPW=await crypto.createHmac('sha256', salt).update(PW).digest('hex');
        console.log(`encPW:${encryptPW}`);
        if(encryptPW===results[0]._doc.pw){
          output.status=100;
          res.send(output);
          console.log('verifypw: right password');
        }else{
          output.status=200;
          res.send(output);
          console.log('verifypw: wrong password');
        }
      }else{
        console.log('verifypw: results.length==0 --> err');
        output.status=402;
        res.send(output);
      }
    }); 
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.verifypw = verifypw;