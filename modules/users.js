const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://mongodb:Arun1117@cluster0.spwl1.mongodb.net/mongodb?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
var conn=mongoose.connection;

const employeeSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },

    email: {
        type:String,
        required:true,
        index:{
            unique:true
        }
    },

    password: {
        type:String,
        required:true,
       

    },
    
    date:{
        type:Date,
        default:Date.now
    }

 

  })

  const userModel = mongoose.model('users', employeeSchema);

  module.exports=userModel;
