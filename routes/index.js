var express = require('express');
var router = express.Router();
var usermodule=require('../modules/users');
var passwordcategorymodule=require('../modules/password_category');
var passwordmodule=require('../modules/add_password');

var jwt = require('jsonwebtoken');
/* GET home page. */
const { check, validationResult } = require('express-validator');
var getpasswordcategory=passwordcategorymodule.find({});
var getallpassword=passwordmodule.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginuser');
  if(loginUser){
    res.redirect('/dashboard');
  }
  else{
  res.render('index', { title: 'Login' , msg1:''});
  }
});




function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');

  try{
    var decoded = jwt.verify(userToken,'logintoken');
  }
  catch(err){
    res.redirect('/');
  }

  next();

}
function checkEmail(req,res,next){

  var email=req.body.email;
  var checkexitemail=usermodule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
return res.render('signup',{ title:'CREATE NEW ACCOUNT',msg:'',msg1:'This email already exist!!!!'});
    }
    next();
  })



}


function checkpasswordcategory1(req,res,next){
  var loginUser=localStorage.getItem('loginuser');
  var email=req.body.passwordcategory;
  var passcatid=req.body.id;
  var checkexitemail=passwordcategorymodule.findOne({passwordcategory:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
return  res.render('edit1', { title: 'Edit Password Category' , loginUser:loginUser ,error:'this category already exist' , msg:'' , records:data , id:passcatid});
    }
    next();
  })
}

  function checkpasswordcategory2(req,res,next){
    var loginUser=localStorage.getItem('loginuser');
    var email=req.body.passwordcategory;
    var checkexitemail=passwordcategorymodule.findOne({passwordcategory:email});
    checkexitemail.exec((err,data)=>{
      if(err) throw err;
      if(data){
  return res.render('newcategory.ejs', { title: 'Add new Category' , loginUser:loginUser ,error:'',msg:'THIS CATEGORY ALREADY EXIST'});

      }
      next();
    })
  }
  
  function checkpasswordname(req,res,next){
    var loginUser=localStorage.getItem('loginuser');
    var email=req.body.passwordname;
    var checkexitemail=passwordmodule.findOne({passwordname:email});
    
var passcatid=req.params.id;
var getpass=passwordmodule.findById(passcatid);
 
checkexitemail.exec(function(err,doc){

  if(err) throw err;
  else if(doc){
    return res.redirect('/viewallpassword');
  }
  

  });
 

   
    
  }

function checkusername(req,res,next){

  var email=req.body.username;
  var checkexitemail=usermodule.findOne({username:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
return res.render('signup',{ title:'CREATE NEW ACCOUNT',msg:'',msg1:'This username already exist!!!!'});
    }
    next();
  })


}


function checkpassword(req,res,next){

  var email=req.body.password;
  var checkexitemail=usermodule.findOne({password:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup',{ title:'CREATE NEW ACCOUNT',msg:'',msg1:'This PASSWORD already exist!!!!'});

    }
    next();
  })


}



router.get('/signup', function(req, res, next) {

  var loginUser=localStorage.getItem('loginuser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
  res.render('signup', { title: 'CREATE NEW ACCOUNT', msg:'',msg1:''});

  }
});


router.post('/signup', checkusername , checkEmail , checkpassword , function(req, res, next) {


  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var cpassword=req.body.cpassword;

  if(password != cpassword){
    res.render('signup', { title: 'CREATE NEW ACCOUNT',msg:'',msg1:'both the passwords should be same' });
 
  }
  else{

    
  var userdetails=new usermodule({

  
username:username,
    email:email,
    password:password

  });
  userdetails.save((err,data)=>{
       
    if(err){
      
    res.render('signup', { title: 'CREATE NEW ACCOUNT',msg:'',msg1:'This email or password already exist' });


    }
    else{



    res.render('signup', { title: 'CREATE NEW ACCOUNT',msg:'user registered successfully',msg1:'' });
    }

  });
}

});
const index1=-1;
const index2=-1;

router.post('/', function(req, res, next) {


  const username=req.body.username;
  const password=req.body.password;

  
   var checkUser=usermodule.findOne({username:username}); 
   checkUser.exec((err,data)=>{


    if(data==null){
      res.render('index.ejs', { title: 'Login', msg1:"Invalid Username " });
  
     }
     else{

   if(err) throw err;
   
     var getId=data._id;
    var getpassword= data.password;

    if(getpassword==password){
      var token = jwt.sign({ userId: getId }, 'logintoken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginuser', username);

      res.redirect('/dashboard');

    }
    else
     res.render('index.ejs', { title: 'Login' , msg1:'Incorrect password' });
     }

   })

   
});


router.get('/dashboard', checkLoginUser , function(req, res, next) {
  var loginUser=localStorage.getItem('loginuser');

  res.render('dashboard.ejs', { title: 'Steps to add new Password:', loginUser:loginUser });
});

router.get('/category', checkLoginUser , function(req, res, next) {  var loginUser=localStorage.getItem('loginuser');


getpasswordcategory.exec(function(err,data){
  if(err) throw err;
  
  res.render('category.ejs', { title: 'Category list' , loginUser:loginUser ,records:data});
  
  })

});

router.get('/delete/:id', checkLoginUser , function(req, res, next) {  var loginUser=localStorage.getItem('loginuser');

var passcatid=req.params.id;
var passdel=passwordcategorymodule.findByIdAndDelete(passcatid);
 

 passdel.exec(function(err,data){

  if(err) throw err;

  res.redirect('/category');

 })

});


router.get('/delete2/:id', checkLoginUser , function(req, res, next) {  var loginUser=localStorage.getItem('loginuser');

var passcatid=req.params.id;
var passdel=passwordmodule.findByIdAndDelete(passcatid);
 

 passdel.exec(function(err,data){

  if(err) throw err;

  res.redirect('/viewallpassword');

 })

});




router.get('/edit2/:id', checkLoginUser , function(req, res, next) {  
  var loginUser=localStorage.getItem('loginuser');

var passcatid=req.params.id;
var getpass=passwordmodule.findById(passcatid);
 

 getpass.exec(function(err,data){

  if(err) throw err;

  getpasswordcategory.exec(function(err,data1){
    if(err) throw err;

  res.render('edit2', { title: 'Edit password ' , loginUser:loginUser ,error:'' , msg:'' , record:data, records:data1 , id:passcatid});
  

  });
 });

});

router.post('/edit2/', checkLoginUser , checkpasswordname , function(req, res, next) {  
  var loginUser=localStorage.getItem('loginuser');

var passcatid=req.body.id;
var passwordcategory=req.body.passwordcategory;
var passworddetails=req.body.passworddetails;
var passwordname=req.body.passwordname;

var getpass=passwordmodule.findByIdAndUpdate(passcatid,{
passwordcategory:passwordcategory,
passwordname:passwordname,
passworddetails:passworddetails


});
 

 getpass.exec(function(err,data){

  if(err) throw err;


  res.redirect('/viewallpassword');

  

  });
 });




router.get('/edit/:id', checkLoginUser , function(req, res, next) {  
  var loginUser=localStorage.getItem('loginuser');

var passcatid=req.params.id;
var getpass=passwordcategorymodule.findById(passcatid);
 

 getpass.exec(function(err,data){

  if(err) throw err;

  res.render('edit1', { title: 'Edit Password Category' , loginUser:loginUser ,error:'' , msg:'' , records:data , id:passcatid});
  
 });
 
});

router.post('/edit/', checkLoginUser , checkpasswordcategory1 , function(req, res, next) {  
  var loginUser=localStorage.getItem('loginuser');

  var passwordcategory=req.body.passwordcategory;

var passcatid=req.body.id;
console.log(passcatid);

var getpass=passwordcategorymodule.findByIdAndUpdate(passcatid,{passwordcategory:passwordcategory})

 getpass.exec((err) => {

     if (err)
       throw err;

     res.redirect('/category');

   });

});






router.get('/newcategory', checkLoginUser, checkpasswordcategory2,  function(req, res, next) { var loginUser=localStorage.getItem('loginuser');




res.render('newcategory.ejs', { title: 'Add new Category' , loginUser:loginUser ,error:'',msg:''});




});


router.get('/newpassword', checkLoginUser , function(req, res, next) { 
  var loginUser=localStorage.getItem('loginuser');


getpasswordcategory.exec(function(err,data){
if(err) throw err;


res.render('newpassword.ejs', { title: 'Add new Password' , loginUser:loginUser ,records:data, msg:''});
})


})

router.post('/newpassword', checkLoginUser , function(req, res, next) { var loginUser=localStorage.getItem('loginuser');

var password_category=req.body.passwordcategory;
var password_details=req.body.passworddetails;
var password_name=req.body.passwordname;
var pass=new passwordmodule({

  passwordcategory:password_category
  ,
  passworddetails:password_details
  ,
  passwordname:password_name
})

pass.save(function(err,doc){

  if(err) throw err;

  getpasswordcategory.exec(function(err,data){
    if(err) throw err;
    


  res.render('newpassword.ejs', { title: 'Add new Password' , loginUser:loginUser ,records:data , msg:'password details inserted successfully'});
})

})

})





router.get('/viewallpassword', checkLoginUser,  function(req, res, next) { 
  
  var loginUser=localStorage.getItem('loginuser');

  getallpassword.exec(function(err,data){
 if(err) throw err;

 res.render('viewallpassword.ejs', { title: 'Password list ', loginUser:loginUser ,records:data });


  })
});





router.post('/newcategory', checkLoginUser,  checkpasswordcategory2, [
  check('passwordcategory','Enter a valid password category').isLength({ min: 3 })
] ,function(req, res, next) { 
  const errors = validationResult(req);
  var loginUser=localStorage.getItem('loginuser');
  if (!errors.isEmpty()) {
    res.render('newcategory.ejs', { title: 'Add new Category', loginUser:loginUser ,error:errors.mapped() , msg:''});
  }
   else{
var loginUser=localStorage.getItem('loginuser');
var passwordcategory=req.body.passwordcategory;

var passwordcategorydetails=new passwordcategorymodule({
passwordcategory:passwordcategory

})

passwordcategorydetails.save(function(err,doc){
  if(err) throw err;
  res.render('newcategory.ejs', { title: 'Add new Category', loginUser:loginUser , error:'' ,msg:'category added successfully'});

})

   }
});


router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginuser');
  
  res.render('index.ejs', { title: ' Login ', msg1:'' });
});


module.exports = router;





  
//set DEBUG=pms:* & npm start