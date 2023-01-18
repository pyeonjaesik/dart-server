var love22 = function(req,res){
  console.log('love22');
  var _id = req.body._id||0;
  var ms_id=req.body.post_id||0;    
  var database = req.app.get('database');    
  var output ={};
  if(database){
    database.MsModel.find({_id:ms_id},(err,results)=>{
      if(err){
        console.log('MsModel.find err');
        output.status=400;
        res.send(output);
        return;
      }
      if(results.length>0){
        var post_id=results[0]._doc.post_id;
        database.LvModel.find({_id:_id},(err,results)=>{
          if(err){
            console.log('LvModel.find err');
            output.status=401;
            res.send(output);
            return;
          }
          if(results.length>0){
            var lvarr=results[0]._doc.lvarr;
            var lvi=lvarr.findIndex((em)=>em.post_id==post_id);
            if(lvi!==-1){
              var msi=lvarr[lvi].ms_id.indexOf(ms_id);
              if(msi!==-1){
                lvarr[lvi].ms_id.splice(msi,1);
                database.LvModel.update({_id:_id},{lvarr:lvarr},(err)=>{
                  if(err){
                    console.log('LvModel.update err');
                    output.status=405;
                    res.send(output);
                    return;
                  }
                  database.MsModel.update({_id:ms_id},{$inc:{ln:-1}},(err)=>{
                    if(err){
                      console.log('MsModel.update err');
                      output.status=406;
                      res.send(output);
                      return;
                    }
                    console.log('love22 success');
                    output.status=100;
                    res.send(output);
                  });
                });
              }else{
                console.log('not loved --> err2');
                output.status=404;
                res.send(output);
              }
            }else{
              console.log('not loved --> err');
              output.status=403;
              res.send(output);
            }
          }else{
            console.log('LvModel.find results.length ==0 -->err');
            output.status=402;
            res.send(output);
          }
        });
      }else{
        console.log('MsModel.find results.length ==0 -->err');
        output.status=401;
        res.send(output);
      }
    });
    // database.LvModel.find({_id:_id},function(err,results){
    //   if(err){
    //     console.log('LvModel err');
    //     output.status=401;
    //     res.send(output);
    //     return;  
    //   }
    //   if(results.length>0){
    //     var lv_arr=[];
    //     lv_arr=results[0]._doc.ms_id;
    //     if(lv_arr.indexOf(post_id)!=-1){
    //       lv_arr.splice(lv_arr.indexOf(post_id),1);
    //       database.LvModel.where({_id:_id}).update({ms_id:lv_arr},function(err){
    //         if(err){
    //           console.log('love22: Lv.update err');
    //           output.status=404;
    //           res.send(output);
    //           return;    
    //         }
    //         database.MsModel.find({_id:post_id},function(err,results){
    //           if(err){
    //             console.log('love22 postModel.find err');
    //             output.status=405;
    //             res.send(output);
    //             return;  
    //           }
    //           if(results.length>0){
    //             var ln=results[0]._doc.ln;
    //             ln--;
    //             database.MsModel.where({_id:post_id}).update({ln:ln},function(err){
    //               if(err){
    //                 console.log('PostModel.update err');
    //                 output.status=407;
    //                 res.send(output);
    //                 return;  
    //               }
    //               output.status=100;
    //               res.send(output);    
    //             });  
    //           }else{
    //             console.log('love22 PostModel.find results.length ==0');
    //             output.status=406;
    //             res.send(output);  
    //           }    
    //         });  
    //       });    
    //     }else{
    //       console.log('love22: already love x');
    //       output.status=403;
    //       res.send(output);    
    //     }  
    //   }else{
    //     console.log('LvModel.find results x');
    //     output.status=402;
    //     res.send(output);  
    //   }    
    // });  
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.love22 = love22;