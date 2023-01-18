var mypost = function(req,res){
    console.log('mypost');
    var param_id = req.body.user_id || 'script';
    var paramid = req.body.userid || 'script';
    var paramtext = req.body.text || ' ';
    var coin=req.body.coin||0;
    coin=parseInt(coin);
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
    if(coin<1){
      console.log('coin<1');
      output.status=500;
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
          database.CoinModel.find({_id:param_id},function(err,results){
            if(err){
              console.log('CoinModel.find err');
              output.status=402;
              res.send(output);
              return;    
            }
            if(results.length>0){
              var coin_amount=results[0]._doc.coin;    
              if(coin_amount<coin){
                console.log('results[0]._doc.coin<coin :'+results[0]._doc.coin+'/'+coin);
                output.status=900;
                res.send(output);
                return;  
              }   
              if(ct==results[0]._doc.d){
                var rdn = results[0]._doc.n;
                if(rdn<1000){
                  rdn++
                  database.TkModel.where({_id:param_id}).update({n:rdn},function(err){
                    if(err){
                      console.log('TkModel.update err');
                      output.status=402;
                      res.send(output);
                      return;    
                    }
                    var post = new database.PostModel({"userid":paramid,"user_id":param_id,"text":paramtext,"created_time":created_time,'coin':0});
                    post.save(function(err,results){
                        if(err){
                          output.status = 4;
                          res.send(output);
                          return;
                        }
                        if(results){
                          output.post_id=results._doc._id;
                          database.CoinModel.find({_id:param_id},function(err,results){
                            if(err){
                              console.log('CoinModel.find err');
                              output.status=405;
                              res.send(output);
                              return;    
                            }
                            var coin_amount=results[0]._doc.coin;  
                            if(coin_amount<coin){
                              console.log('results[0]._doc.coin<coin :'+results[0]._doc.coin+'/'+coin);
                              output.status=900;
                              res.send(output);
                              return;  
                            }
                            var pp=results[0]._doc.p;
                            var ss=results[0]._doc.s;
                            var tt=results[0]._doc.t;
                            var ee=results[0]._doc.e;
                            ee.unshift({post_id:output.post_id,coin:coin,ct:parseInt(Date.now())}); 
                            function removeDuplicates(originalArray, prop) {
                                 var newArray = [];
                                 var lookupObject  = {};

                                 for(var i in originalArray) {
                                    lookupObject[originalArray[i][prop]] = originalArray[i];
                                 }

                                 for(i in lookupObject) {
                                     newArray.push(lookupObject[i]);
                                 }
                                  return newArray;
                            }
                            ee = removeDuplicates(ee, "post_id");
                            ee.pop();  
                            var ppl=pp.length;
                            var ssl=ss.length;
                            var ttl=tt.length;
                            var eel=ee.length;
                            var coin_price=0;  
                            for(var i=0;i<ppl;i++){
                              coin_price+=pp[i].coin;    
                            }
                            for(var i=0;i<ssl;i++){
                              coin_price-=ss[i].coin;    
                            }
                            for(var i=0;i<ttl;i++){
                              coin_price+=tt[i].coin;    
                            }
                            for(var i=0;i<eel;i++){
                              coin_price-=ee[i].coin;    
                            }                              
                            if(coin_price!=(coin_amount-coin)){
                              console.log('11coin_price!=coin_amount :'+coin_price+'/'+coin_amount+'/'+coin);
                              output.status=901;
                              res.send(output);
                              return;  
                            }
                            database.CoinModel.where({_id:param_id}).update({coin:(coin_amount-coin),e:ee},function(err){
                              if(err){
                                console.log('CoinModel.update err2');
                                output.status=406;
                                res.send(output);
                                return;  
                              }
                              database.PostModel.where({_id:output.post_id}).update({coin:coin},function(err){
                                if(err){
                                  console.log('PostModel.update err');
                                  output.status=407;
                                  res.send(output);
                                    // 이 경우 내 장부로 반드시 데이터 전송
                                  return;    
                                }
                                console.log('my post success');
                                output.status=100;
                                res.send(output);  
                              });    
                            });  
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
                database.TkModel.where({_id:param_id}).update({d:ct,n:1},function(err){
                  if(err){
                    console.log('TkModel.update err');
                    output.status=405;
                    res.send(output);
                    return;  
                  }
                    var post = new database.PostModel({"userid":paramid,"user_id":param_id,"text":paramtext,"created_time":created_time,'coin':0});
                    post.save(function(err,results){
                        if(err){
                            output.status = 4;
                            res.send(output);
                            return;
                        }
                        if(results){
                          output.post_id=results._doc._id;
                          database.CoinModel.find({_id:param_id},function(err,results){
                            if(err){
                              console.log('CoinModel.find err');
                              output.status=405;
                              res.send(output);
                              return;    
                            }
                            var coin_amount=results[0]._doc.coin;  
                            if(coin_amount<coin){
                              console.log('results[0]._doc.coin<coin :'+results[0]._doc.coin+'/'+coin);
                              output.status=900;
                              res.send(output);
                              return;  
                            }
                            var pp=results[0]._doc.p;
                            var ss=results[0]._doc.s;
                            var tt=results[0]._doc.t;
                            var ee=results[0]._doc.e;
                            ee.unshift({post_id:output.post_id,coin:coin,ct:parseInt(Date.now())}); 
                            function removeDuplicates(originalArray, prop) {
                                 var newArray = [];
                                 var lookupObject  = {};

                                 for(var i in originalArray) {
                                    lookupObject[originalArray[i][prop]] = originalArray[i];
                                 }

                                 for(i in lookupObject) {
                                     newArray.push(lookupObject[i]);
                                 }
                                  return newArray;
                            }
                            ee = removeDuplicates(ee, "post_id");
                            ee.pop();  
                            var ppl=pp.length;
                            var ssl=ss.length;
                            var ttl=tt.length;
                            var eel=ee.length;
                            var coin_price=0;  
                            for(var i=0;i<ppl;i++){
                              coin_price+=pp[i].coin;    
                            }
                            for(var i=0;i<ssl;i++){
                              coin_price-=ss[i].coin;    
                            }
                            for(var i=0;i<ttl;i++){
                              coin_price+=tt[i].coin;    
                            }
                            for(var i=0;i<eel;i++){
                              coin_price-=ee[i].coin;    
                            }                              
                            if(coin_price!=(coin_amount-coin)){
                              console.log('11coin_price!=coin_amount :'+coin_price+'/'+coin_amount+'/'+coin);
                              output.status=901;
                              res.send(output);
                              return;  
                            }
                            database.CoinModel.where({_id:param_id}).update({coin:(coin_amount-coin),e:ee},function(err){
                              if(err){
                                console.log('CoinModel.update err2');
                                output.status=406;
                                res.send(output);
                                return;  
                              }
                              database.PostModel.where({_id:output.post_id}).update({coin:coin},function(err){
                                if(err){
                                  console.log('PostModel.update err');
                                  output.status=407;
                                  res.send(output);
                                    // 이 경우 내 장부로 반드시 데이터 전송
                                  return;    
                                }
                                console.log('my post success');
                                output.status=100;
                                res.send(output);  
                              });    
                            });  
                          });                            
                        }else{
                          output.status=403;
                          res.send(output);    
                        }
                    });                  
                });  
              }                  
            }else{
              console.log('CoinModel.find results.length==0 -->err');
              output.status=403;
              res.send(output);    
            }  
          });
        }else{
          console.log('TkModel.find results.length ==0 -->token changed or ddos');
          output.status=600;
          res.send(output);    
        }  
      });
    }else{
        console.log('mypost: database 없음');
        output.status = 10;
        res.send(output);
    }
};
module.exports.mypost = mypost;