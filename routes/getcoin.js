var getcoin = function(req,res){
  var _id=req.body._id;
  var output={};    
  var database = req.app.get('database');    
  if(database.db){
    database.CoinModel.find({_id:_id},function(err,results){
      if(err){
        console.log('CoinModel.find err');
        output.status=401;
        res.send(output);  
      }
      if(results.length>0){
        output.status=100;
        output.coin=results[0]._doc.coin;
        res.send(output);  
        console.log('getcoin: coin='+results[0]._doc.coin);  
      }else{
        console.log('CoinModel.find results.length==0 -->err');
        output.status=402;
        res.send(output);  
      }    
    })
  }else{
    output.status = 410;
    res.send(output);
  }
};
module.exports.getcoin = getcoin;