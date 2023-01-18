var alarm = function(req,res){
  console.log('alarm')
  var _id = req.body._id||0;
  var database = req.app.get('database');    
  var output ={};
  output.post=[];    
  if(database){
    database.AlarmModel.find({_id:_id},(err,results)=>{
      if(err){
        console.log('alarm: AlarmModel.find err');
        output.status=401;
        res.send(output);
        return;
      }
      if(results){
        output.post=results[0]._doc.alarm.map((em)=>em);
        output.status=100;
        res.send(output);
      }else{
        console.log('alarm: AlarmModel.find results.length==0 -->err');
        output.status=402;
        res.send(output);
      }
    });
  }else{
    console.log('alarm : no database');
    output.status =410;
    res.send(output);
  }
};
module.exports.alarm = alarm;