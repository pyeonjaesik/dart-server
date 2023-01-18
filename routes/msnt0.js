var msnt0 = function(req,res){
  console.log('msnt0');
  var ms_id = req.body.ms_id||0;
    console.log('ms_id:'+ms_id);
  var database = req.app.get('database');    
  var output ={};
  if(database){
    database.MsModel.where({_id:ms_id}).update({nt:0},function(err){
      if(err){
        console.log('msnt0: msmodel update err');
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
module.exports.msnt0 = msnt0;