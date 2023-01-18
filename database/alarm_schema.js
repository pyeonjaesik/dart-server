var Schema = {};
Schema.createSchema = function(mongoose){
  var AlarmSchema = mongoose.Schema({
    alarm:[],
  });
  return AlarmSchema;    
};
module.exports = Schema;