var getmainpost2 = function(req,res){
  var database = req.app.get('database');
  var t_index= req.body.t_index||0;
  var _id= req.body._id||0;
  var output ={};
  output.post =[];
  output.postlimit=20;  
  console.log(`getmainpost: t_index=${t_index}
    _id =${_id}`);
  if(database){
    database.PostModel.find({idx:1,created_time:{$lt:t_index}},function(err,results){
      if(err){
        console.log('PostModel.find err');
        output.status=403;
        res.send(output);
        return;  
      }
      if(results){
        var rel=results.length;
        for(var i=0;i<rel;i++){
          output.post[i]={
            key:results[i]._doc._id,
            id:results[i]._doc.userid,
            txt:results[i]._doc.text,
            clip:results[i]._doc.clip.splice(0,30),
            im:results[i]._doc.im,
            coin:results[i]._doc.coin,
            ct:results[i]._doc.created_time,
            ln:results[i]._doc.ln,
            cn:results[i]._doc.cn,
            ci:results[i]._doc.ci
          };   
        }
        if(t_index==999999999999999 && _id!=0){
          database.CoinModel.find({_id:_id},(err,results)=>{
            if(err){
              console.log(`getmainpost CoinModel.find err`);
              output.status=404;
              res.send(output);
              return;
            }
            if(results.length>0){
              output.status=101;
              output.coin=results[0]._doc.coin;
              console.log('getmainpost status ==101');
              res.send(output);
            }else{
              console.log(`getmainpost CoinModel.find results.length ==0 --> err`);
              output.status=405;
              res.send(output);
            }
          });
        }else{
          output.status=100; 
          console.log('getmainpost status ==100');
          res.send(output); 
        }
      }else{
        output.status=402;
        res.send(output);  
      }    
    }).sort({created_time:-1}).limit(output.postlimit);  
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.getmainpost2 = getmainpost2;