var axios = require('axios');
var paymentcomplete = async function(req,res){
  console.log('paymentcomplete');
    var database = req.app.get('database');  
    var output={};
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        console.log('1');
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: "2606978355989762", // REST API키
                imp_secret: "XwULMaU1VzjeHYKsMt1BGvzG7lS0STNPpHBbRwcM6v1NuMggfhSWMrCUNvUFoIvNq7YhDb4KH6xbSNs8" // REST API Secret
            }
        });
        console.log(getToken);
        console.log('11');
        const { access_token } = getToken.data.response; // 인증 토큰
        console.log('2');
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보  
        
//        const order = await Orders.findById(paymentData.merchant_uid);
//        console.log('222');
//        const amountToBePaid = order.amount; // 결제 되어야 하는 금액
     //   console.log(' 결제 되어야 하는 금액'+amountToBePaid);
        // 결제 검증하기
        database.MctModel.find({merchant:paymentData.merchant_uid},function(err,results){
          if(err){
            console.log('MctModel.find err');
            output.status=403;
            res.send(output);
            return;  
          }
          if(results.length>0){
            var user_id=results[0]._doc.user_id;
            const amountToBePaid=results[0]._doc.amount;
               ///////////
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
         //   await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장

            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                  //  await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
                    // 가상계좌 발급 안내 문자메시지 발송
                    SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    console.log('1');
                    break;
                case "paid": // 결제 완료
                  database.UserModel.find({user_id:user_id},(err,results)=>{
                    if(err){
                      console.log('pay complete: UserModel find err');
                      output.status=401;
                      res.send(output);
                      /////////////// 내 장부로 반드시 오류 보고.
                      return; 
                    }
                    if(results.length>0){
                      var _id=results[0]._doc._id;
                      database.CoinModel.find({_id:_id},function(err,results){
                        if(err){
                          console.log('CoinModel.find err');
                          output.status=402;
                          res.send(output);
                          return;  
                        }
                        if(results.length>0){
                          var purchase_d={mct_id:paymentData.merchant_uid,imp_uid:paymentData.imp_uid,coin:parseInt(amount/110),ct:parseInt(Date.now())}  
                          var purchase=results[0]._doc.p;
                          purchase.unshift(purchase_d);
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
  
                          purchase = removeDuplicates(purchase, "mct_id");
                          purchase.pop();
                          console.dir(purchase);
                          //output.status="success";
                          console.log(purchase[0]);
                          var ss=results[0]._doc.s;
                          var ee=results[0]._doc.e;
                          var tt=results[0]._doc.t;
                          var ssl=ss.length;
                          var eel=ee.length;
                          var ttl=tt.length;
                          var purl=purchase.length;  
                          var coin_price=0;  
                          for(var i=0;i<purl;i++){
                            coin_price+=purchase[i].coin;    
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
                          if(coin_price==(parseInt(results[0]._doc.coin)+parseInt(amount/110))){
                            database.CoinModel.where({_id:_id}).update({p:purchase,coin:coin_price},function(err){
                              if(err){
                                console.log('CoinModel.update err');
                                console.dir(err);
                                output.status=801;
                                res.send(output);
                                return;    
                              }
                              output.status="success";
                              res.send(output);
                              console.log('pay success! congraturation!');  
                            });  
                          }else{
                            console.log('coin_price!=results[0]._doc.coin:'+coin_price+'/'+(parseInt(results[0]._doc.coin)+parseInt(amount/110)));
                              //나중에 이 경우에 대해서 꼭 손봐줄 것.
                          }  
                        }else{
                          console.log('CoinModel.find results==0 --> err');
                          output.status=403;
                          res.send(output);  
                        }    
                      });
                    }else{
                      console.log('pay complete: UserModel find results.length==0 -->err');
                      output.status=401;
                      res.send(output);
                      /////////////// 내 장부로 반드시 오류 보고.
                    }
                  });
                  //  res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            console.log('amount/amountTobePaid:'+amount+'/'+amountToBePaid);
            output.status=800;
            res.send(output);
        }               
               
               /////////////
          }else{
            console.log('MctModel.find results.length==0 -->err');
            output.status=404;
            res.send(output);  
          }    
        });
        //        
    } catch (e) {
        res.status(400).send(e);
    }
};
module.exports.paymentcomplete = paymentcomplete;