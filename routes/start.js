var start = function(req,res){
  console.log('start');
  var _id = req.body._id||0;
  var database = req.app.get('database');    
  var output ={};
  output.lvarr=[];    
  if(database){
    database.LvModel.find({_id:_id},function(err,results){
      if(err){
        console.log('start err');
        output.status=401;
        res.send(output);
        return;  
      }
      if(results.length>0){
        output.lvarr=results[0]._doc.post_id;
        output.lvarr2=results[0]._doc.ms_id;  
        output.status=100;
        res.send(output);  
      }else{
        console.log('start: LvModel.find err');
        output.status=402;
        res.send(output);  
      }    
    });
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.start = start;