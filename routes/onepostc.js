var onepostc = function(req,res){
  console.log('onepostc');
  var _id = req.body._id||0;
  var tcn_t = req.body.tcn;
  var n_times = req.body.n_times;  
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
        var tcn=tcn_t;  
        output.post={_id:results[0]._doc._id,id:results[0]._doc.userid,txt:results[0]._doc.text,img:results[0]._doc.img1,coin:results[0]._doc.coin,ct:results[0]._doc.created_time,ln:results[0]._doc.ln,idx:results[0]._doc.idx,ci:results[0]._doc.ci,cp:results[0]._doc.cp,tcn:tcn};
        if(tcn>0){
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
              if(rel>0){
               var lastnt=results[rel-1]._doc.created_time;   
              }
              database.MsModel.find({post_id:_id,created_time:{$lt:lastnt}},function(err,results){
                if(err){
                  console.log('MsModel.find err2');
                  output.status=406;
                  res.send(output);
                  return;  
                }
                if(results){
                  var rel=results.length;
                  for(var i=0;i<rel;i++){
                  output.reply.push({_id:results[i]._doc._id,id:results[i]._doc.userid,txt:results[i]._doc.text,img:results[i]._doc.img,vdo:results[i]._doc.vdo,ct:results[i]._doc.created_time,ln:results[i]._doc.ln});  
                  }
                  if(n_times==0){
                    database.PostModel.where({_id:_id}).update({tcn:0,a:0},function(err,results){
                      if(err){
                        console.log('onepostc tcn update err');
                        output.status=408;
                        res.send(output);
                        return;  
                      }
                      console.dir(results);    
                      output.status=100;
                      res.send(output);                    
                    });
                  }else{         
                    output.status=100;
                    res.send(output);  
                  }                    
                }else{
                  console.log('MsModel.find2 not results');
                  output.status=405;
                  res.send(output);
                }    
              }).sort({ln:-1}).limit(301-tcn);  
            }else{
              console.log('MsModel.find not results');
              output.status=405;
              res.send(output);  
            }      
          }).sort({_id:-1}).limit(tcn);            
        }else{
          database.MsModel.find({post_id:_id},function(err,results){
            if(err){
              console.log('MsModel.find err2');
              output.status=406;
              res.send(output);
              return;  
            }
            if(results){
              var rel=results.length;
              for(var i=0;i<rel;i++){
              output.reply.push({_id:results[i]._doc._id,id:results[i]._doc.userid,txt:results[i]._doc.text,img:results[i]._doc.img,vdo:results[i]._doc.vdo,ct:results[i]._doc.created_time,ln:results[i]._doc.ln});  
              }
              if(n_times==0){
                database.PostModel.where({_id:_id}).update({a:0},function(err,results){
                  if(err){
                    console.log('onepostc tcn update err');
                    output.status=408;
                    res.send(output);
                    return;  
                  }
                  console.dir(results);    
                  output.status=100;
                  res.send(output);                    
                });
              }else{         
                output.status=100;
                res.send(output);  
              }    
            }else{
              console.log('MsModel.find2 not results');
              output.status=405;
              res.send(output);
            }    
          }).sort({ln:-1}).limit(300);            
        }  
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
module.exports.onepostc = onepostc;