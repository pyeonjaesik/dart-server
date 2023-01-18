var Schema = {};
Schema.createSchema = function(mongoose){
  var LvSchema = mongoose.Schema({
    lvarr:[]
  });
  return LvSchema;    
};
module.exports = Schema;