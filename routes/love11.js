var love11 = function(req,res){
  console.log('love11');
  var _id = req.body._id||0;
  var ms_id=req.body.post_id||0;    
  var database = req.app.get('database');    
  var output ={};
  if(database){
    database.MsModel.find({_id:ms_id},(err,results)=>{
      if(err){
        console.log(`love11: MsModel.find err`);
        output.status=401;
        res.send(output);
        return;
      }
      if(results.length>0){
        var post_id=results[0]._doc.post_id;
        var user_id=results[0]._doc.user_id;
        var ms_txt=results[0]._doc.text.substring(0,30);
        database.LvModel.find({_id:_id},(err,results)=>{
          if(err){
            console.log('love11: LvModel.find err');
            output.status=403;
            res.send(output);
            return;
          }
          if(results.length>0){
            var lvarr=results[0]._doc.lvarr;
            var lvi=lvarr.findIndex((em)=>em.post_id==post_id);
            if(lvi!==-1){
              if(lvarr[lvi].ms_id.indexOf(ms_id)!==-1){
                console.log('love11: already love');
                output.status=405;
                res.send(output);
                return;
              }else{
                var lvarr_tmp={post_id:post_id,ms_id:[ms_id,...lvarr[lvi].ms_id]};
                lvarr.splice(lvi,1,lvarr_tmp);
              }
            }else{
              lvarr.unshift({post_id:post_id,ms_id:[ms_id]});
            }
            database.LvModel.update({_id:_id},{lvarr:lvarr},(err)=>{
              if(err){
                console.log('love11:LvModel.update err');
                output.status=406;
                res.send(output);
                return;
              }
              database.MsModel.update({_id:ms_id},{$inc:{ln:1}},(err)=>{
                if(err){
                  console.log('love11:MsModel.update err');
                  output.status=407;
                  res.send(output);
                  return;
                }
                //
                database.AlarmModel.find({_id:user_id},(err,results)=>{
                  if(err){
                    console.log('mymission: AlarmModel.update err');
                    output.status=405;
                    res.send(output);
                    return;
                  }
                  if(results.length>0){
                    let a_index=results[0]._doc.alarm.findIndex((em)=>em.type===4 && em.ms_id===ms_id);
                    var alarm_tmp={
                      post_id:post_id,
                      ms_id:ms_id,
                      ln:a_index===-1?1:(results[0]._doc.alarm[a_index].ln+1),
                      txt:ms_txt,
                      ct:parseInt(Date.now()),
                      type:4
                    }
                    var alarm=results[0]._doc.alarm;
                    if(a_index===-1){
                      alarm.unshift(alarm_tmp);
                    }else{
                      alarm.splice(a_index,1);
                      alarm.unshift(alarm_tmp);
                    }
                    database.AlarmModel.update({_id:user_id},{alarm:alarm},(err)=>{
                      if(err){
                        console.log('love11:AlarmMOdle.update err');
                        output.status=408;
                        res.send(output);
                        return;
                      }
                      output.status=100;
                      res.send(output);
                    });
                  }else{
                    console.log('love11 : AlarmModel.find results x --> err');
                    output.status=407;
                    res.send(output);
                  }
                });
              });
            });
          }else{
            console.log('love11: LvModel.find results.length ==0 -->err');
            output.status=404;
            res.send(output);
          }
        });
      }else{
        console.log('love11: MsModel.find results.length ==0 -->err');
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
module.exports.love11 = love11;