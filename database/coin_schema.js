var Schema = {};
Schema.createSchema = function(mongoose){
  var CoinSchema = mongoose.Schema({
    coin:{type:Number,'default':'0'},  
    p:[], //coin 구매
    s:[], // coin 환전
    g:[],
    t:[],  // 보상으로 coin 을 획득
    e:[]   // 다른사람에게 보상으로써 coin 을 제공
  });
  return CoinSchema;    
};
module.exports = Schema;