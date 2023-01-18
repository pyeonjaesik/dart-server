var Schema = {};

Schema.createSchema = function(mongoose){
    var PostSchema = mongoose.Schema({
        userid:{type: String, required:true,'default':''},
        user_id:{type: String, required:true,'default':'',index: 'hashed'},
        text:{type: String,trim:false,default:''},
        clip:[],
        im:{type: String,default:''},
        created_time:{type:Number, 'default': 1519021633963},
        coin:{type:Number, 'default': 0},
        ln:{type:Number, 'default':0},
        idx:{type:Number, 'default':0},
        ci:{type:String, 'default':''},
        cp:{type:String, 'default':''},
        cn:{type:Number, 'default':0},
        // tcn:{type:Number, 'default':0},
        // ct:{type:Number, 'default':0},
        // nt:{type:Number, 'default':0},
        // a:{type:Number, 'default':0},
        b:{type:Number, 'default':0}
//        tk:[],
//        cm:[]
    });
    
    return PostSchema;
};

module.exports = Schema;