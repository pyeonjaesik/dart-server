var alarmflush = function(req,res){
  var _id = req.body._id||0;
  var database = req.app.get('database');    
  var output ={};
  output.post=[];    
  if(database){
    database.AlarmModel.update({_id:_id},{alarm:[]},(err)=>{
      if(err){
        console.log('Alarmflush: AlarmModel.update err');
        output.status=401;
        res.send(output);r
        return;
      }
      output.status=100;
      res.send(output);
    });
  }else{
    console.log('alarmflush : no database');
    output.status =410;
    res.send(output);
  }
};
module.exports.alarmflush = alarmflush;