var getcoinpost = function(req,res){
  var database = req.app.get('database');
  var user_id = req.body._id;    
  var output ={};
  output.post =[];    
  if(database){
    database.CoinModel.find({_id:user_id},function(err,results){
      if(err){
        console.log('CoinModel.find err');
        output.status=401;
        res.send(output);
        return;  
      }
      if(results.length>0){
        var pp=results[0]._doc.p;
        var ppl=pp.length;  
        var ppa=[];  
        for(var i=0;i<ppl;i++){
          ppa[i]={coin:pp[i].coin,ct:pp[i].ct};    
        }
        output.p=[];
        output.s=[];
        output.e=[];
        output.t=[];
        output.p=ppa;
        output.s=results[0]._doc.s
        output.e=results[0]._doc.e;
        output.t=results[0]._doc.t;
        output.status=100;
        res.send(output);
          console.dir(output);
          console.log('ssl:'+output.s.length+'/eel:'+output.e.length+'/ppl:'+output.p.length+'/ttl:'+output.t.length);
      }else{
        console.log('CoinModel.find results.length ==0 --> err');
        output.status=402;
        res.send(output);  
      }    
    });
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.getcoinpost = getcoinpost;