var exchange = function(req, res) {
  console.log('exchange');
  var crypto = require('crypto');
  var output={};
  var PW = req.body.pw||0;
  var _id = req.body._id;
  var bank = req.body.bank;
  var name = req.body.name;
  var number = req.body.number;
  var coin = parseInt(req.body.coin);
  var ct=parseInt(Date.now())
  var database = req.app.get('database');
	if (database.db) {
    database.UserModel.find({_id:_id},async function(err,results){
      if(err){
        console.log('exchange: err');
        output.status=401;
        res.send(output);
        return;
      }
      if(results.length>0){
        var salt = results[0]._doc.salt;
        var encryptPW=await crypto.createHmac('sha256', salt).update(PW).digest('hex');
        if(encryptPW===results[0]._doc.pw){
          database.CoinModel.find({_id:_id},function(err,results){
            if(err){
              console.log('mscp: CoinModel.find err'); 
              output.status=405;
              res.send(output);
              return;  
            }
            if(results.length>0){
              var ss=results[0]._doc.s;
              function checkss(em){
                return em.ct==ct;
              }
              var ssi=ss.findIndex(checkss);
              if(ssi===-1 && coin<=results[0]._doc.coin && coin>=30){
                ss.unshift({coin,ct,bank,name,number});    
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
                ss = removeDuplicates(ss, "ct");
                ss.pop();    
                var pp=results[0]._doc.p;    
                var ee=results[0]._doc.e;
                var tt=results[0]._doc.t;
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
                if(parseInt(coin_price)!==parseInt(results[0]._doc.coin-coin)){
                  console.log('exchange: CoinModel auth6 failed');
                  output.status=506;
                  res.send(output); 
                  return;
                }
                database.CoinModel.update({_id:_id},{s:ss,coin:coin_price},(err)=>{
                  if(err){
                    console.log('exchange: CoinModel.update err');
                    output.status=403;
                    res.send(output);
                    return;
                  }
                  var exchange = new database.ExchangeModel({
                    coin,
                    bank,
                    name,
                    number,
                    ct,
                    user_id:_id,
                    index:0
                  });
                  exchange.save((err)=>{
                    if(err){
                      console.log('exchange.save err ==> 이 경우 내 장부에서 반드시 체크!');
                      output.status=601;
                      res.send(output);
                      return;
                    }
                    output.coin=coin_price;
                    output.status=100;
                    res.send(output);
                    console.log('exchange success');
                  });
                });
              }else{
                console.log(`
                  exchange: CoinModel auth1 failed
                  ssi=${ssi} 
                  coin=${coin} 
                  mycoin=${results[0]._doc.coin}
                `);
                output.status=503;
                res.send(output);
                return;    
              }  
            }else{
              console.log('exchange: CoinModel.find results.length ==0 -->err');
              output.status=406;
              res.send(output);  
            }    
          });
        }else{
          output.status=200;
          res.send(output);
          console.log('exchange: wrong password');
        }
      }else{
        console.log('exchange: results.length==0 --> err');
        output.status=402;
        res.send(output);
      }
    }); 
	} else {
    output.status =4;
    res.send(output);
	}
	
};
module.exports.exchange = exchange;