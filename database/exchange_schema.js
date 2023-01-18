var Schema = {};
Schema.createSchema = function(mongoose){
  var ExchangeSchema = mongoose.Schema({
    coin:{type:Number,'default':0},  
    ct:{type:Number,'default':0},
    bank:{type:String, 'default':''},
    name:{type:String, 'default':''},
    number:{type:String, 'default':''},
    user_id:{type:String, 'default':''},
    index:{type:Number,'default':0}, // 0 : 신청만 한 상태, 1 : 신청하고 내가 환전해준 상태
  });
  return ExchangeSchema;    
};
module.exports = Schema;