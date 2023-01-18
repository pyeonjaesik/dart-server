var makemct = function(req,res){
  var user_id=req.body.user_id;
  var mct=req.body.mct;
  var amount=req.body.amount;
  console.log('makemct'+user_id);
  var output={};    
  var database = req.app.get('database');    
  if(database.db){
    var Mct_model = new database.MctModel({user_id:user_id,merchant:mct,ct:parseInt(Date.now()),amount:amount});
    Mct_model.save(function(err){
      if(err){
        console.log('Mct_model.save err');
        console.dir(err);
        output.status=401;
        res.send(output);
        return;    
      }
      database.UserModel.find({user_id:user_id},(err,results)=>{
        if(err){
          console.log('makemct: UserModel.find err');
          output.status=402;
          res.send(output);
          return;
        }
        if(results.length>0){
          output.id=results[0]._doc.id;
          output.status=100;
          res.send(output); 
        }else{
          console.log('UserModel.find results.length ==0 -->err');
          output.status=403;
          res.send(output);
        }
      });   
    });      
  }else{
    output.status = 410;
    res.send(output);
  }
};
module.exports.makemct = makemct;