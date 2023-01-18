var mymission = function(req,res){
    console.log('mymission');
    var param_id = req.body.user_id || 'script';
    var paramid = req.body.userid || 'script';
    var paramtext = req.body.text || ' ';
    console.log('paramtext:'+paramtext);
    var post_id=req.body.post_id||0;
    // var paramtext = paramtext.replace(/(\n|\r\n)/g, '<br>');
    var xss = require("xss");
    paramtext=xss(paramtext);    
    var tk=req.body.tk||'123';
    var created_time = parseInt(Date.now());
    var ct=parseInt(Date.now()/86400000);
    var output = {}; 
    var database = req.app.get('database');
    var output = {};
    if(tk.length<4){
      console.log('TkModel.find err');
      output.status=600;
      res.send(output);
      return;         
    }
    if(database){
      database.TkModel.find({tk:tk},function(err,results){
        if(err){
          console.log('TkModel.find err');
          output.status=501;
          res.send(output);
          return;    
        }
        if(results.length>0){
            //나중에 주석 풀 것
          if(results[0]._doc._id!=param_id){
            console.log('ddos detected-- hacker stoled other token or objectid');
            output.status=502;
            res.send(output);
            return;  
          }
          if(ct==results[0]._doc.c){
            var rdn = results[0]._doc.p;
            if(rdn<300){
              rdn++
              database.TkModel.where({_id:param_id}).update({p:rdn},function(err){
                if(err){
                  console.log('TkModel.update err');
                  output.status=402;
                  res.send(output);
                  return;    
                }
                var Ms = new database.MsModel({"userid":paramid,"user_id":param_id,"text":paramtext,"created_time":created_time,'post_id':post_id});
                Ms.save(function(err,results){
                    if(err){
                      output.status = 4;
                      res.send(output);
                      return;
                    }
                    if(results){
                      output.ms_id=results._doc._id;    
                      database.PostModel.find({_id:post_id},function(err,results){
                        if(err){
                          console.log('mymission: PostModel.find err');
                          output.status=404;
                          res.send(output);   
                          return;    
                        }
                        if(results.length>0){
                          var cn=results[0]._doc.cn;
                          cn++;
                          var a=results[0]._doc.a;
                          if(a==0){
                            a=2;   
                          }else{
                            a=3;
                          }
                          var tcn=results[0]._doc.tcn;
                          tcn++;    
                          database.PostModel.where({_id:post_id}).update({cn:cn,nt:parseInt(Date.now()),a:a,tcn:tcn},function(err){
                            if(err){
                              console.log('PostModel.update err');
                              output.status=406;
                              res.send(output);
                              return;    
                            }
                            output.status=100;
                            res.send(output);  
                          });    
                        }else{
                          console.log('mymission: PostModel.find results.length==0 -->err');
                          output.status=405;
                          res.send(output);    
                        }  
                      });                       
                    }else{
                      output.status=403;
                      res.send(output);    
                    }
                });                  
              });    
            }else{
              output.status=102;
              res.send(output);    
            }  
          }else{
            database.TkModel.where({_id:param_id}).update({c:ct,p:1},function(err){
              if(err){
                console.log('TkModel.update err');
                output.status=405;
                res.send(output);
                return;  
              }
                var Ms = new database.MsModel({"userid":paramid,"user_id":param_id,"text":paramtext,"created_time":created_time,'post_id':post_id});
                Ms.save(function(err,results){
                    if(err){
                      output.status = 4;
                      res.send(output);
                      return;
                    }
                    if(results){
                      output.ms_id=results._doc._id;    
                      database.PostModel.find({_id:post_id},function(err,results){
                        if(err){
                          console.log('mymission: PostModel.find err');
                          output.status=404;
                          res.send(output);   
                          return;    
                        }
                        if(results.length>0){
                          var cn=results[0]._doc.cn;
                          cn++;
                          var a=results[0]._doc.a;
                          if(a==0){
                            a=2;   
                          }else{
                            a=3;
                          }
                          var tcn=results[0]._doc.tcn;
                          tcn++;    
                          database.PostModel.where({_id:post_id}).update({cn:cn,nt:parseInt(Date.now()),a:a,tcn:tcn},function(err){
                            if(err){
                              console.log('PostModel.update err');
                              output.status=406;
                              res.send(output);
                              return;    
                            }
                            output.status=100;
                            res.send(output);  
                          });    
                        }else{
                          console.log('mymission: PostModel.find results.length==0 -->err');
                          output.status=405;
                          res.send(output);    
                        }  
                      });                        
                    }else{
                      output.status=403;
                      res.send(output);    
                    }
                });                  
            });  
          }
        }else{
          console.log('TkModel.find results.length ==0 -->token changed or ddos');
          output.status=600;
          res.send(output);    
        }  
      });
    }else{
        console.log('mymission: database 없음');
        output.status = 10;
        res.send(output);
    }
};
module.exports.mymission = mymission;