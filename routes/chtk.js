var chtk = function(req,res){
  console.log('chtk');
  var _id = req.body._id||0;
  var ptk = req.body.ptk;    
  var database = req.app.get('database');    
  var output ={};
  if(database){
    database.TkModel.where({_id:_id}).update({ptk:ptk},function(err){
      if(err){
        console.log('chtk: push token update err');
        output.status=401;
        res.send(output);
        return;  
      }
      output.status=100;
      res.send(output);    
    });
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.chtk = chtk;