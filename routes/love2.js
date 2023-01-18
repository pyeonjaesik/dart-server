var love2 = function(req,res){
  console.log('love2');
  var _id = req.body._id||0;
  var post_id=req.body.post_id||0;    
  var database = req.app.get('database');    
  var output ={};
  if(database){
    database.LvModel.find({_id:_id},function(err,results){
      if(err){
        console.log('LvModel err');
        output.status=401;
        res.send(output);
        return;  
      }
      if(results.length>0){
        var lv_arr=[];
        lv_arr=results[0]._doc.post_id;
        if(lv_arr.indexOf(post_id)!=-1){
          lv_arr.splice(lv_arr.indexOf(post_id),1);
          database.LvModel.where({_id:_id}).update({post_id:lv_arr},function(err){
            if(err){
              console.log('love1: Lv.update err');
              output.status=404;
              res.send(output);
              return;    
            }
            database.PostModel.find({_id:post_id},function(err,results){
              if(err){
                console.log('love1 postModel.find err');
                output.status=405;
                res.send(output);
                return;  
              }
              if(results.length>0){
                var ln=results[0]._doc.ln;
                ln--;
                database.PostModel.where({_id:post_id}).update({ln:ln},function(err){
                  if(err){
                    console.log('PostModel.update err');
                    output.status=407;
                    res.send(output);
                    return;  
                  }
                  output.status=100;
                  res.send(output);    
                });  
              }else{
                console.log('love1 PostModel.find results.length ==0');
                output.status=406;
                res.send(output);  
              }    
            });  
          });    
        }else{
          console.log('love2: already love x');
          output.status=403;
          res.send(output);    
        }  
      }else{
        console.log('LvModel.find results x');
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
module.exports.love2 = love2;