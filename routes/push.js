var push = function(req,res){
    console.log('1');
  var id= req.body.id||0;
  var FCM = require('fcm-node');
  var database = req.app.get('database');
  var output ={};
  var client_token;   
  var ct = parseInt(Date.now());  
  if(database){
      var al3={s:'ss',asdas:'asdda'};
    database.TkModel.find({id:id},function(err,results){
        console.log('666');
      if(err){
        console.log('TkModel.find err');
        output.status=401;
        res.send(output);
        return;  
      }
      if(results.length>0){
          console.log('77');
        client_token = results[0]._doc.ptk;   
        var serverKey = 'AAAAMZQpZhw:APA91bH3VxukWhL0Fh0ONfxFwxKu1VcKPo9XU-N0nBgQZVu3P20hxsKV7Fxza8nKkwMooakQkRzMmxx9idRjq4fZiRgH-hLh5-gGv7NVieKPe5ZOCkOyfvf0woeZbn-PvmO8Ypu5eDP-';
        var push_data = {
          to: client_token,
          notification: {
            title: "새로운 팔로우",
            body: "님이 팔로우 합니다.",
            sound: "default",
            icon: "fcm_push_icon"
          },
//          priority: "high",
          restricted_package_name: "com.app.metacoin",
          data: al3
        };
          console.log('88')
        var fcm = new FCM(serverKey);
          console.log('444');
          var ppl=1;
          if(ppl==1){
              ppl=2;
        fcm.send(push_data, function(err) {
            
            console.log('55');
          if (err) {
            console.log('err1'+err);
            output.status=700;
            res.send(output); 
            return;
          }
           console.log('err1'+err);
            console.log('2222');
            output.status=100;
           res.send(output);
            return;
            console.log('3');
        });   
          }
             
      }else{
        console.log('TkModel.find: results.length==0 -->err');
        output.status=411;
        res.send(output);  
      }    
    });  
  }else{
    console.log('push1: no database');
    output.status=410;
    res.send(output);  
  }   
};
module.exports.push = push;