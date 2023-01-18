var onepostp = function(req,res){
  console.log('onepostp');
  var _id = req.body._id||0;    
  var database = req.app.get('database');    
  var output ={};
  output.post ={};
  output.reply=[];    
  if(database){
    database.PostModel.find({_id:_id},function(err,results){
      if(err){
        console.log('PostModel.find err');
        output.status=403;
        res.send(output);
        return;  
      }
      if(results.length>0){
        output.post={_id:results[0]._doc._id,id:results[0]._doc.userid,txt:results[0]._doc.text,img:results[0]._doc.img1,coin:results[0]._doc.coin,ct:results[0]._doc.created_time,ln:results[0]._doc.ln,ci:results[0]._doc.ci,cp:results[0]._doc.cp};
        database.MsModel.find({post_id:_id},function(err,results){
          if(err){
            console.log('MsModel.find err');
            output.status=404;
            res.send(output);
            return;  
          }
          if(results){
            var rel=results.length;
            for(var i=0;i<rel;i++){
              output.reply[i]={_id:results[i]._doc._id,id:results[i]._doc.userid,txt:results[i]._doc.text,img:results[i]._doc.img,vdo:results[i]._doc.vdo,ct:results[i]._doc.created_time,ln:results[i]._doc.ln};  
            }
            output.status=100;
            res.send(output);  
          }else{
            console.log('MsModel.find not results');
            output.status=405;
            res.send(output);  
          }    
        }).sort({ln:-1}).limit(300);  
      }else{
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
module.exports.onepostp = onepostp;