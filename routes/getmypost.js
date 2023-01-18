var getmypost = function(req,res){
  console.log('getmypost');    
  var database = req.app.get('database');
  var user_id=req.body._id;    
  var output ={};
  output.post =[];    
  if(database){
    database.PostModel.find({user_id:user_id},function(err,results){
      if(err){
        console.log('PostModel.find err');
        output.status=403;
        res.send(output);
        return;  
      }
      if(results.length>0){
        var rel=results.length;
        for(var i=0;i<rel;i++){
          output.post[i]={
            _id:results[i]._doc._id,
            id:results[i]._doc.userid,
            txt:results[i]._doc.text,
            clip:results[i]._doc.clip,
            coin:results[i]._doc.coin,
            im:results[i]._doc.im,
            ct:results[i]._doc.created_time,
            ln:results[i]._doc.ln,
            cn:results[i]._doc.cn,
            ci:results[i]._doc.ci
          };   
        }
        output.status=100; 
        res.send(output);  
      }else{
        output.status=402;
        res.send(output);  
      }    
    }).sort({_id:-1}).limit(300);  
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.getmypost = getmypost;