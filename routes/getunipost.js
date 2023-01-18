var getunipost = function(req,res){
  var database = req.app.get('database');
  var output ={};
  output.post =[];
  output.post2 =[];
  output.postlimit=20;    
// var arrarr;
// for(var i=0;i<100;i++){
//   if(i<10){
//     var jj=i+'a';
//   }else{
//     var jj=i;
//   }
//   arrarr+=`
//       {
//         "_id" : ObjectId("5c87ca31d8d40702d53ee4${jj}"),
//         "userid" : "${i}",
//         "user_id" : "5c485b9b0c8f4b02e267d3ec",
//         "text" : "${i}번쨰 입니다.",
//         "img1" : "0",
//         "created_time" : 15522993221${i}0.0,
//         "coin" : ${i},
//         "ln" : 0,
//         "idx" : 0,
//         "ci" : "",
//         "cp" : "",
//         "cn" : 0,
//         "tcn" : 0,
//         "ct" : 0,
//         "nt" : 0,
//         "a" : 0,
//         "b" : 0,
//         "__v" : 0
//     }
//   `
// }
// arrarr = arrarr.replace(/(\n|\r\n)/g, '');
// console.log(arrarr)
  if(database){
    database.PostModel.find({idx:0},function(err,results){
      if(err){
        console.log('PostModel.find err');
        output.status=403;
        res.send(output);
        return;  
      }
      if(results){
        var rel=results.length;
        for(var i=0;i<rel;i++){
          output.post[i]={
            key:results[i]._doc._id,
            id:results[i]._doc.userid,
            txt:results[i]._doc.text,
            clip:results[i]._doc.clip,
            im:results[i]._doc.im,
            coin:results[i]._doc.coin,
            ct:results[i]._doc.created_time,
            ln:results[i]._doc.ln,
            cn:results[i]._doc.cn
          };   
        }
        database.PostModel.find({idx:1},function(err,results){
          if(err){
            console.log('PostModel.find err');
            output.status=403;
            res.send(output);
            return;  
          }
          if(results){
            var rel=results.length;
            for(var i=0;i<rel;i++){
              output.post2[i]={
                key:results[i]._doc._id,
                id:results[i]._doc.userid,
                txt:results[i]._doc.text,
                clip:results[i]._doc.clip,
                im:results[i]._doc.im,
                coin:results[i]._doc.coin,
                ct:results[i]._doc.created_time,
                ln:results[i]._doc.ln,
                cn:results[i]._doc.cn,
                ci:results[i]._doc.ci,
              };   
            }
            output.status=100; 
            console.log('getunipost');
            res.send(output);  
          }else{
            console.log('getunipost length x --> err');
            output.status=402;
            res.send(output);  
          }    
        }).sort({created_time:-1}).limit(output.postlimit);  
      }else{
        console.log('getunipost length x --> err');
        output.status=402;
        res.send(output);  
      }    
    }).sort({created_time:-1}).limit(output.postlimit);  
  }else{
    console.log('database 없음');
    output.status =410;
    res.send(output);
  }
};
module.exports.getunipost = getunipost;