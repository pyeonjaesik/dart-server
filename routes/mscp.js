var mscp = function(req,res){
  var _id = req.body._id||0;
  var id2 = req.body.id2||0;    
  var post_id=req.body.post_id||0;
  var ms_id=req.body.ms_id||0;
  var PW = req.body.pw||0;
  var database = req.app.get('database');
  var crypto = require('crypto');    
  var output ={};
//  if(id==id2){
//    console.log('mscp id==id2');
//    output.status=400;
//    res.send(output);
//    return;  
//  }    

// !!!!!!!!!!!!!!147-153 주석 반드시 풀것!!!!!!!!!!!!!!!!!!!!!!!! ==> 완료
// 154줄 삭제할것. => 완료
  if(database){  
    database.UserModel.find({_id:_id},async function(err,results){
      if(err){
        console.log('verifypw: err');
        output.status=401;
        res.send(output);
        return;
      }
      if(results.length>0){
        var salt = results[0]._doc.salt;
        var encryptPW=await crypto.createHmac('sha256', salt).update(PW).digest('hex');
        if(encryptPW===results[0]._doc.pw){
          database.PostModel.find({_id:post_id},function(err,results){
            if(err){
              console.log('mscp: PostModel.find err');
              output.status=403;
              res.send(output);
              return;    
            }
            if(results.length>0){
              if(results[0]._doc.idx==1){
                console.log('mscp: idx:1');
                output.status=500;
                res.send(output);
                return;  
              }
              var post_txt=results[0]._doc.text.substring(0,30);    
              var post_coin=results[0]._doc.coin;    
              if(_id===results[0]._doc.user_id){
                database.CoinModel.find({_id:_id},function(err,results){
                  if(err){
                    console.log('mscp: CoinModel.find err'); 
                    output.status=405;
                    res.send(output);
                    return;  
                  }
                  if(results.length>0){
                    var ee=results[0]._doc.e;
                    function checkee(em){
                      return em.post_id==post_id;
                    }
                    var eei=ee.findIndex(checkee);
                    if(eei!=-1){
                      if(post_coin==ee[eei].coin){
                        database.MsModel.find({post_id:post_id},function(err,results){
                          if(err){
                            console.log('mscp: MsModel.find err');
                            output.status=407;
                            res.send(output);
                            return;  
                          }
                          var rel=results.length;    
                          if(rel>0){ 
                            var msln1=results[rel-1]._doc.ln;
                            database.MsModel.find({_id:ms_id},function(err,results){
                              if(err){
                                console.log('mscp: MsModel.find2 err');
                                output.status=407;
                                res.send(output);
                                return;  
                              }
                              if(results.length>0){
                                if(results[0]._doc.ln<msln1){
                                  console.log('mscp:MsModel auth8 failed');
                                  output.status=508;
                                  res.send(output);
                                  return;    
                                }
                                if(results[0]._doc.post_id!=post_id){
                                  console.log('mscp:MsModel auth9 failed');
                                  output.status=509;
                                  res.send(output);
                                  return;                                      
                                }
                                var user_id2=results[0]._doc.user_id;
                                database.CoinModel.find({_id:user_id2},function(err,results){
                                  if(err){
                                    console.log('mscp: CoinModel.find2 err');
                                    output.status=409;
                                    res.send(output);
                                    return;    
                                  }
                                  if(results.length>0){
                                    var tt=results[0]._doc.t;
                                    tt.unshift({post_id:post_id,coin:post_coin,ct:parseInt(Date.now())});    
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
                                    tt = removeDuplicates(tt, "post_id");
                                    tt.pop();    
                                    var pp=results[0]._doc.p;    
                                    var ss=results[0]._doc.s;
                                    var ee=results[0]._doc.e;
                                    var ppl=pp.length;    
                                    var ssl=ss.length;
                                    var eel=ee.length;
                                    var ttl=tt.length; // 이유는 잘 모르겠으나 원래의 ttl보다 1 만큼 더 크게나온다;
                                    var coin_price=0; 
                                    for(var i=0;i<ppl;i++){
                                      coin_price+=pp[i].coin; 
                                    }
                                    for(var i=0;i<ssl;i++){
                                      coin_price-=ss[i].coin; 
                                    }
                                    for(var i=0;i<eel;i++){
                                      coin_price-=ee[i].coin;    
                                    }
                                    for(var i=0;i<ttl;i++){
                                      coin_price+=tt[i].coin;    
                                    }
                                    if(parseInt(coin_price)!==parseInt(results[0]._doc.coin+post_coin)){
                                      console.log('mscp: CoinModel auth6 failed');
                                      console.log(coin_price+'/'+(results[0]._doc.coin+post_coin));
                                      output.status=506;
                                      res.send(output); 
                                      return;
                                    }
                                    // coin_price=parseInt(results[0]._doc.coin+post_coin); // 나중에 주석처리할 것.
                                    database.PostModel.where({_id:post_id}).update({idx:1,ci:id2,cp:ms_id,ct:parseInt(Date.now()),nt: parseInt(Date.now())},function(err){
                                      if(err){
                                        output.status=412;
                                        console.log('mscp PostModel.update err');
                                        res.send(output);
                                        return;  
                                      }
                                      database.CoinModel.where({_id:user_id2}).update({t:tt,coin:coin_price},function(err){
                                        if(err){
                                          console.log('mscp: Coin update err');
                                          output.status=413;
                                          res.send(output);
                                          return;  
                                        }
                                        let alarm={post_id:post_id,txt:post_txt,coin:post_coin,ct:parseInt(Date.now()),type:2}
                                        database.AlarmModel.update({_id:user_id2},{ $push: {
                                            alarm: {
                                              $each:[alarm],
                                              $position: 0
                                            }  
                                          } 
                                        },(err)=>{
                                          if(err){
                                            console.log('mscp success but alarm failed');
                                            output.status=100;
                                            res.send(output);
                                            return;
                                          }
                                          console.log('mscp success');
                                          output.status=100;
                                          res.send(output);
                                        });
                                      });                                        
                                    });    
                                  }else{
                                    console.log('mscp: CoinModel.find2 results.length == 0 --> err');
                                    output.status=411;
                                    res.send(output);    
                                  }  
                                });                                  
                              }else{
                                console.log('mscp: MsModel.find2 results.length ==0 --> err');
                                output.status=408;
                                res.send(output);
                                return;  
                              }    
                            });
                          }else{
                            console.log('mscp: MsModel.find results.length ==0 --> err');
                            output.status=408;
                            res.send(output);  
                          }    
                        }).sort({ln:-1}).limit(10); 
                      }else{
                        console.log('mscp CoinModel auth4 failed');
                        output.status=504;
                        res.send(output);  
                      }    
                    }else{
                      console.log('mscp CoinModel auth3 failed');
                      output.status=503;
                      res.send(output);
                      return;    
                    }  
                  }else{
                    console.log('mscp: CoinModel.find results.length ==0 -->err');
                    output.status=406;
                    res.send(output);  
                  }    
                });  
              }else{
                console.log('mscp: Post auth failed');
                output.status=502;
                res.send(output);  
              }    
            }else{
              console.log('mscp: PostModel.find results.length ==0 --> err');
              output.status=404;
              res.send(output);    
            }  
          });
        }else{
          output.status=200;
          res.send(output);
          console.log('verifypw: wrong password');
        }
      }else{
        console.log('verifypw: results.length==0 --> err');
        output.status=402;
        res.send(output);
      }
    });
  }else{
    console.log('mscp: no database');
    output.status =410;
    res.send(output);
  }
};
module.exports.mscp = mscp;