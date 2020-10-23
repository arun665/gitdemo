const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://mongodb:Arun1117@cluster0.spwl1.mongodb.net/mongodb?retryWrites=true&w=majority', {useNewUrlParser: true,'useFindAndModify': false, useUnifiedTopology: true,'useUnifiedTopology': true, useCreateIndex: true});
var conn=mongoose.connection;

const passwordSchema = new mongoose.Schema({
    passwordcategory:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    
    
    date:{
        type:Date,
        default:Date.now
    }

 

  })

  const passwordcategoryModel = mongoose.model('userspassword', passwordSchema);

  module.exports=passwordcategoryModel;
