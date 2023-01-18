var faketoken = function(req,res){
  var _id=req.body._id;
  var tk=req.body.tk;
    console.log('faketoken tk:'+tk)
  var output={};    
  var database = req.app.get('database');    
  if(database.db){
    database.TkModel.where({_id:_id}).update({tk:tk},function(err){
      if(err){
        console.log('faketoken: UserModel.update err');
        output.status=401;
        res.send(output);
        return;  
      }
      output.status=100;
      res.send(output);    
    });
  }else{
    output.status = 410;
    res.send(output);
  }
};
module.exports.faketoken = faketoken;