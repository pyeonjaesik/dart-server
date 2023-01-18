var oneposta4 = function(req,res){
  console.log('oneposta4');
  var _id = req.body._id||0; 
  var ms_id = req.body.ms_id||0;
  var user_id = req.body.user_id||0;    
  var database = req.app.get('database');
  var output ={};
  output.post =[];
  output.lnindex=99999999;
  if(database){
    database.AlarmModel.find({_id:user_id},(err,results)=>{
      if(err){
        console.log('oneposta2: AlarmModel.find err');
        output.status=301;
        res.send(output);
        return;
      }
      if(results.length>0){
        var alarm=results[0]._doc.alarm;
        var ai=alarm.findIndex((em)=>em.type==4&&em.ms_id==ms_id);
        if(ai!==-1){
          alarm.splice(ai,1);
        }
        database.AlarmModel.update({_id:user_id},{alarm:alarm},(err)=>{
          if(err){
            console.log('oneposta2: AlarmModle.update err');
            output.status=302;
            res.send(output);
            return;
          }
          database.PostModel.find({_id:_id},function(err,results){
            if(err){
              console.log('PostModel.find err');
              output.status=403;
              res.send(output);
              return;  
            }
            if(results.length>0){
              if(user_id===results[0]._doc.user_id){
                output.mine=true;
              }else{
                output.mine=false;
              }
              if(results[0]._doc.idx==0){
                output.select=false;
                output.post[0]={
                  key:results[0]._doc._id,
                  id:results[0]._doc.userid,
                  txt:results[0]._doc.text,
                  clip:results[0]._doc.clip.splice(0,30),
                  im:results[0]._doc.im,
                  coin:results[0]._doc.coin,
                  ct:results[0]._doc.created_time,
                  ln:results[0]._doc.ln,
                  cn:results[0]._doc.cn,
                  idx:results[0]._doc.idx,
                  ci:results[0]._doc.ci,
                  cp:results[0]._doc.cp,
                  type:0
                };
                database.LvModel.find({_id:user_id},function(err,results){
                  if(err){
                    console.log('onepost: lv find err');
                    output.status=430;
                    res.send(output);
                    return;
                  }
                  if(results){
                    let lvarr=results[0]._doc.lvarr;
                    var lvi=lvarr.findIndex((em)=>em.post_id==_id); 
                    database.MsModel.find({post_id:_id},function(err,results){
                      if(err){
                        console.log('MsModel.find err');
                        output.status=404;
                        res.send(output);
                        return;  
                      }
                      if(results){
                        var rel=results.length;
                        if(lvi===-1){
                          for(var i=0;i<rel;i++){
                            output.post.push({
                              key:results[i]._doc._id,
                              id:results[i]._doc.userid,
                              txt:results[i]._doc.text,
                              clip:results[i]._doc.clip.splice(0,30),
                              im:results[i]._doc.im,
                              ct:results[i]._doc.created_time,
                              ln:results[i]._doc.ln,
                              type:1,
                              like:false
                            })
                          }
                        }else{
                          for(var i=0;i<rel;i++){
                            output.post.push({
                              key:results[i]._doc._id,
                              id:results[i]._doc.userid,
                              txt:results[i]._doc.text,
                              clip:results[i]._doc.clip.splice(0,30),
                              im:results[i]._doc.im,
                              ct:results[i]._doc.created_time,
                              ln:results[i]._doc.ln,
                              type:1,
                              like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                            });
                          }
                        }
                        if(rel<10){
                          output.status=100;
                          output.lnindex=0;
                          var ms_id_index=output.post.findIndex((em)=>em.key==ms_id);
                          if(ms_id_index===-1){
                            console.log('ms_id_index==-1 --> err');
                            res.send(output);
                            return;
                          }
                          var my_post_temp={...output.post[ms_id_index],type:4};
                          output.post.splice(ms_id_index,1);
                          output.post.splice(1,0,my_post_temp);
                          res.send(output);
                          return;
                        }
                        var lnindex=results[rel-1]._doc.ln;
                        output.lnindex=lnindex;
                        database.MsModel.find({post_id:_id,ln:lnindex,created_time:{$lt:results[rel-1]._doc.created_time}},(err,results)=>{
                          if(err){
                            console.log('MsModel.find err2');
                            output.status=405;
                            res.send(output);
                            return;
                          }
                          var rel=results.length;
                          if(lvi===-1){
                            for(var i=0;i<rel;i++){
                              output.post.push({
                                key:results[i]._doc._id,
                                id:results[i]._doc.userid,
                                txt:results[i]._doc.text,
                                clip:results[i]._doc.clip.splice(0,30),
                                im:results[i]._doc.im,
                                ct:results[i]._doc.created_time,
                                ln:results[i]._doc.ln,
                                type:1,
                                like:false
                              })
                            }
                          }else{
                            for(var i=0;i<rel;i++){
                              output.post.push({
                                key:results[i]._doc._id,
                                id:results[i]._doc.userid,
                                txt:results[i]._doc.text,
                                clip:results[i]._doc.clip.splice(0,30),
                                im:results[i]._doc.im,
                                ct:results[i]._doc.created_time,
                                ln:results[i]._doc.ln,
                                type:1,
                                like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                              })
                            }
                          }
                          database.MsModel.find({post_id:_id,ln:{$lt:lnindex}},(err,results)=>{
                            if(err){
                              console.log('love11: MsModel.find err');
                              output.status=412;
                              res.send(output);
                              return;
                            }
                            if(results){
                              var rel=results.length;
                              if(lvi===-1){
                                for(var i=0;i<rel;i++){
                                  output.post.push({
                                    key:results[i]._doc._id,
                                    id:results[i]._doc.userid,
                                    txt:results[i]._doc.text,
                                    clip:results[i]._doc.clip.splice(0,30),
                                    im:results[i]._doc.im,
                                    ct:results[i]._doc.created_time,
                                    ln:results[i]._doc.ln,
                                    type:2,
                                    like:false
                                  })
                                }
                              }else{
                                for(var i=0;i<rel;i++){
                                  output.post.push({
                                    key:results[i]._doc._id,
                                    id:results[i]._doc.userid,
                                    txt:results[i]._doc.text,
                                    clip:results[i]._doc.clip.splice(0,30),
                                    im:results[i]._doc.im,
                                    ct:results[i]._doc.created_time,
                                    ln:results[i]._doc.ln,
                                    type:2,
                                    like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                                  })
                                }
                              }
                              var ms_id_index=output.post.findIndex((em)=>em.key==ms_id);
                              if(ms_id_index===-1){
                                database.MsModel.find({_id:ms_id},(err,results)=>{
                                  if(err){
                                    console.log('oneposta4: MsModel.find err1');
                                    output.status=301;
                                    res.send(output);
                                    return;
                                  }
                                  if(results.length>0){
                                    if(lvi===-1){
                                      output.splice(1,0,{
                                        key:results[0]._doc._id,
                                        id:results[0]._doc.userid,
                                        txt:results[0]._doc.text,
                                        clip:results[0]._doc.clip.splice(0,30),
                                        im:results[0]._doc.im,
                                        ct:results[0]._doc.created_time,
                                        ln:results[0]._doc.ln,
                                        type:4,
                                        like:false
                                      });
                                    }else{
                                      output.splice(1,0,{
                                        key:results[0]._doc._id,
                                        id:results[0]._doc.userid,
                                        txt:results[0]._doc.text,
                                        clip:results[0]._doc.clip.splice(0,30),
                                        im:results[0]._doc.im,
                                        ct:results[0]._doc.created_time,
                                        ln:results[0]._doc.ln,
                                        type:4,
                                        like:lvarr[lvi].ms_id.indexOf(results[0]._doc._id.toString())===-1?false:true
                                      });
                                    }
                                    output.status=100;
                                    res.send(output);
                                  }else{
                                    console.log('oneposta4: MsModel.find results.length==0 -->err');
                                    output.status=302;
                                    res.send(output);
                                  }
                                });
                              }else{
                                var my_post_temp={...output.post[ms_id_index],type:4};
                                output.post.splice(ms_id_index,1);
                                output.post.splice(1,0,my_post_temp);
                                output.status=100;
                                res.send(output);
                              }
                            }else{
                              console.log('love11: MsModel.find results.length==0 -->err');
                              output.status=413;
                              res.send(output);
                            }
                          }).sort({created_time:-1}).limit(200);
                        }).sort({created_time:-1}).limit(30)  
                      }else{
                        console.log('MsModel.find not results');
                        output.status=405;
                        res.send(output);  
                      }    
                    }).sort({ln:-1,created_time:-1}).limit(10);
                  }else{
                   console.log('onepost: lv find2 err');
                   output.status=431;
                   res.send(output);
                  }
                });
              }else{
                var cp=results[0]._doc.cp;
                output.select=true;
                output.post[0]={
                  key:results[0]._doc._id,
                  id:results[0]._doc.userid,
                  txt:results[0]._doc.text,
                  clip:results[0]._doc.clip.splice(0,30),
                  im:results[0]._doc.im,
                  coin:results[0]._doc.coin,
                  ct:results[0]._doc.created_time,
                  ln:results[0]._doc.ln,
                  cn:results[0]._doc.cn,
                  idx:results[0]._doc.idx,
                  ci:results[0]._doc.ci,
                  cp:results[0]._doc.cp,
                  type:0
                };
                database.LvModel.find({_id:user_id},async function(err,results){
                  if(err){
                    console.log('onepost: lv find err');
                    output.status=430;
                    res.send(output);
                    return;
                  }
                  if(results){
                    let lvarr=results[0]._doc.lvarr;
                    var lvi=lvarr.findIndex((em)=>em.post_id==_id);
                    database.MsModel.find({_id:ms_id},(err,results)=>{
                      if(err){
                        console.log('oneposta4: MsModel.find err1');
                        output.status=301;
                        res.send(output);
                        return;
                      }
                      if(results.length>0){
                        if(lvi===-1){
                          output.post[1]={
                            key:results[0]._doc._id,
                            id:results[0]._doc.userid,
                            txt:results[0]._doc.text,
                            clip:results[0]._doc.clip.splice(0,30),
                            im:results[0]._doc.im,
                            ct:results[0]._doc.created_time,
                            ln:results[0]._doc.ln,
                            like:false,
                            type:4
                          }
                        }else{
                          output.post[1]={
                            key:results[0]._doc._id,
                            id:results[0]._doc.userid,
                            txt:results[0]._doc.text,
                            clip:results[0]._doc.clip.splice(0,30),
                            im:results[0]._doc.im,
                            ct:results[0]._doc.created_time,
                            ln:results[0]._doc.ln,
                            like:lvarr[lvi].ms_id.indexOf(results[0]._doc._id.toString())===-1?false:true,
                            type:4
                          }
                        }
                        database.MsModel.find({post_id:_id,_id:{$nin:[cp,ms_id]}},function(err,results){
                          if(err){
                            console.log('MsModel.find err');
                            output.status=404;
                            res.send(output);
                            return;  
                          }
                          if(results){
                            var rel=results.length;
                            if(lvi===-1){
                              for(var i=0;i<rel;i++){
                                output.post.push({
                                  key:results[i]._doc._id,
                                  id:results[i]._doc.userid,
                                  txt:results[i]._doc.text,
                                  clip:results[i]._doc.clip.splice(0,30),
                                  im:results[i]._doc.im,
                                  ct:results[i]._doc.created_time,
                                  ln:results[i]._doc.ln,
                                  type:1,
                                  like:false
                                })
                              }
                            }else{
                              for(var i=0;i<rel;i++){
                                output.post.push({
                                  key:results[i]._doc._id,
                                  id:results[i]._doc.userid,
                                  txt:results[i]._doc.text,
                                  clip:results[i]._doc.clip.splice(0,30),
                                  im:results[i]._doc.im,
                                  ct:results[i]._doc.created_time,
                                  ln:results[i]._doc.ln,
                                  type:1,
                                  like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                                })
                              }
                            }
                            if(rel<10){
                              output.lnindex=0;
                              if(cp==ms_id){
                                output.status=100;
                                res.send(output);
                                return;
                              }else{
                                database.MsModel.find({_id:cp},(err,results)=>{
                                  if(err){
                                    console.log('MsModel.find err');
                                    output.status=601;
                                    return;
                                  }
                                  if(results.length>0){
                                    if(lvi===-1){
                                      output.post.splice(2,0,{
                                        key:results[0]._doc._id,
                                        id:results[0]._doc.userid,
                                        txt:results[0]._doc.text,
                                        clip:results[0]._doc.clip.splice(0,30),
                                        im:results[0]._doc.im,
                                        ct:results[0]._doc.created_time,
                                        ln:results[0]._doc.ln,
                                        like:false,
                                        type:3
                                      })
                                    }else{
                                      output.post.splice(2,0,{
                                        key:results[0]._doc._id,
                                        id:results[0]._doc.userid,
                                        txt:results[0]._doc.text,
                                        clip:results[0]._doc.clip.splice(0,30),
                                        im:results[0]._doc.im,
                                        ct:results[0]._doc.created_time,
                                        ln:results[0]._doc.ln,
                                        like:lvarr[lvi].ms_id.indexOf(results[0]._doc._id.toString())===-1?false:true,
                                        type:3
                                      })
                                    }
                                    output.status=100;
                                    res.send(output);
                                  }else{
                                    console.log('MsModel.find results.length==0 -->err');
                                    output.status=602;
                                  }
                                });
                                return;
                              }
                            }
                            var lnindex=results[rel-1]._doc.ln;
                            output.lnindex=lnindex;
                            database.MsModel.find({post_id:_id,ln:lnindex,created_time:{$lt:results[rel-1]._doc.created_time},_id:{$nin:[cp,ms_id]}},(err,results)=>{
                              if(err){
                                console.log('MsModel.find err2');
                                output.status=405;
                                res.send(output);
                                return;
                              }
                              var rel=results.length;
                              if(lvi===-1){
                                for(var i=0;i<rel;i++){
                                  output.post.push({
                                    key:results[i]._doc._id,
                                    id:results[i]._doc.userid,
                                    txt:results[i]._doc.text,
                                    clip:results[i]._doc.clip.splice(0,30),
                                    im:results[i]._doc.im,
                                    ct:results[i]._doc.created_time,
                                    ln:results[i]._doc.ln,
                                    type:1,
                                    like:false
                                  });
                                }
                              }else{
                                for(var i=0;i<rel;i++){
                                  output.post.push({
                                    key:results[i]._doc._id,
                                    id:results[i]._doc.userid,
                                    txt:results[i]._doc.text,
                                    clip:results[i]._doc.clip.splice(0,30),
                                    im:results[i]._doc.im,
                                    ct:results[i]._doc.created_time,
                                    ln:results[i]._doc.ln,
                                    type:1,
                                    like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                                  });
                                }
                              }
                              database.MsModel.find({post_id:_id,ln:{$lt:lnindex},_id:{$nin:[cp,ms_id]}},(err,results)=>{
                                if(err){
                                  console.log('love11: MsModel.find err');
                                  output.status=412;
                                  res.send(output);
                                  return;
                                }
                                if(results){
                                  var rel=results.length;
                                  if(lvi===-1){
                                    for(var i=0;i<rel;i++){
                                      output.post.push({
                                        key:results[i]._doc._id,
                                        id:results[i]._doc.userid,
                                        txt:results[i]._doc.text,
                                        clip:results[i]._doc.clip.splice(0,30),
                                        im:results[i]._doc.im,
                                        ct:results[i]._doc.created_time,
                                        ln:results[i]._doc.ln,
                                        type:2,
                                        like:false
                                      })
                                    }
                                  }else{
                                    for(var i=0;i<rel;i++){
                                      output.post.push({
                                        key:results[i]._doc._id,
                                        id:results[i]._doc.userid,
                                        txt:results[i]._doc.text,
                                        clip:results[i]._doc.clip.splice(0,30),
                                        im:results[i]._doc.im,
                                        ct:results[i]._doc.created_time,
                                        ln:results[i]._doc.ln,
                                        type:2,
                                        like:lvarr[lvi].ms_id.indexOf(results[i]._doc._id.toString())===-1?false:true
                                      })
                                    }
                                  }
                                  if(cp==ms_id){
                                    output.status=100;
                                    res.send(output);
                                  }else{
                                    database.MsModel.find({_id:cp},(err,results)=>{
                                      if(err){
                                        console.log('MsModel.find err');
                                        output.status=601;
                                        return;
                                      }
                                      if(results.length>0){
                                        if(lvi===-1){
                                          output.post.splice(2,0,{
                                            key:results[0]._doc._id,
                                            id:results[0]._doc.userid,
                                            txt:results[0]._doc.text,
                                            clip:results[0]._doc.clip.splice(0,30),
                                            im:results[0]._doc.im,
                                            ct:results[0]._doc.created_time,
                                            ln:results[0]._doc.ln,
                                            like:false,
                                            type:3
                                          })
                                        }else{
                                          output.post.splice(2,0,{
                                            key:results[0]._doc._id,
                                            id:results[0]._doc.userid,
                                            txt:results[0]._doc.text,
                                            clip:results[0]._doc.clip.splice(0,30),
                                            im:results[0]._doc.im,
                                            ct:results[0]._doc.created_time,
                                            ln:results[0]._doc.ln,
                                            like:lvarr[lvi].ms_id.indexOf(results[0]._doc._id.toString())===-1?false:true,
                                            type:3
                                          })
                                        }
                                        output.status=100;
                                        res.send(output);
                                      }else{
                                        console.log('MsModel.find results.length==0 -->err');
                                        output.status=602;
                                      }
                                    });
                                  }
                                }else{
                                  console.log('love11: MsModel.find results.length==0 -->err');
                                  output.status=413;
                                  res.send(output);
                                }
                              }).sort({created_time:-1}).limit(200);
                            }).sort({created_time:-1}).limit(30)  
                          }else{
                            console.log('MsModel.find not results');
                            output.status=405;
                            res.send(output);  
                          }    
                        }).sort({ln:-1,created_time:-1}).limit(10); 
                      }else{
                        output.status=302;
                        res.send(output);
                        console.log('oneposta4: MsModel.find err22');
                      }
                    });
                  }else{
                   console.log('onepost: lv find2 err');
                   output.status=431;
                   res.send(output);
                  }
                });
              }
            }else{
              output.status=402;
              res.send(output);  
            }    
          });
        });
      }else{
        console.log('oneposta2:AlarmModel.find results.length ==0 -->err');
        output.status=303;
        res.send(output);
      }
    });  
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.oneposta4 = oneposta4;