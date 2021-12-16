const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const nodemailer = require('nodemailer');
const session = require('express-session');
const flash = require('connect-flash');
const port = 9000;


const {initPayment, responsePayment} = require("./paytm/services/index.js");
app.use(cors());
// const router = express.Router();
const db = require('./config/mongoose');
const user = require('./models/user');
const OTP = require('./models/token');
const path = require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(express.static(__dirname));

var transport = nodemailer.createTransport(
  {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service : 'Gmail',
  auth: {
      user:'businessinfinty@gmail.com',
       pass:'templates(*)'
}
      
  }
)

app.get('/',function(req,res){
    // res.sendFile(path.join(__dirname,'/style.css'));
    // res.sendFile(path.join(__dirname,'../views/index.ejs'));
    return res.render('index',{
      username:'Log In'
    });
   
    //__dirname : It will resolve to your project folder.
  });
app.get('/login',function(req,res){
    res.sendFile(path.join(__dirname,'/login.html'));
    //__dirname : It will resolve to your project folder.
  });
  app.post('/loginpage',function(req,res){
    // res.sendFile(path.join(__dirname,'/login.html'));
      // console.log(req.body);
      user.findOne({email:req.body.email},function(err,user)
      {
        if(err)
        {
          console.log('error in finding the user');
          return ;
        }
        else
        {
          if(!user)
          {
            res.redirect('/signuppage');
            return ;
          }
          if(user.password==req.body.password)
          {
            // res.render('/index.',{

             
            console.log('login successfully ',user.name);
            res.render('index',{
              username:user.name
            });
            // res.redirect('/');
              //  return ;
          }
          else
          {
            console.log('you have entered the worng password');
            // res.redirect('back');
            // return ;
            res.redirect('back'); 
            return ;
          }
          
          return ; 
        } 
       
      });
      
      // return ;
      // console.log(req.body);
      
  });
  app.get('/signuppage',function(req,res){
    res.sendFile(path.join(__dirname,'signuppage.html'));
    return ;
     });
    
    //__dirname : It will resolve to your project folder.
 
  app.post('/signupinfo',function(req,res){
    user.findOne({email:req.body.email},function(err,User)
    {
      if(err)
      {
        console.log("error in finding the user in databases");
        return ;
      }
      else{
        if(User)
        {
          res.redirect('back');
          return ;
        }
        else if(req.body.password==req.body.confrimpassword)
        { 
          const Otp = Math.floor((Math.random()*1000000)+1);
          var mailOptions = {
            from:'businessinfinty@gmail.com',
            to:req.body.email,
            subject:'One Time Password For Registration',
            html:'<h1> hello'+req.body.name+'</h1>'+'<h1>this  is your one time password do not tell it to anybody'+Otp+'</h1>' + '<h1 style="color:red"></h1>'
          }
          transport.sendMail(mailOptions,function(err,info){
            if(err)
            {
                console.log('error in sending the mail');
                res.redirect('signuppage');
                return;
            };
            console.log('mail is sent');
            // res.sendFile(path.join(__dirname,'otppage.html'));
            req.flash('success','otp sent successfully to your email id');
            res.render('otppage',{
              email:req.body.email,
              flash:req.flash('success')
            })
            return ;
          });

          user.create({name:req.body.name,
            email:req.body.email,
            password:req.body.password},function(err,data){
            if(err)
            {
              console.log('error in creating the user');
              return ;
            }
            console.log(data);
           })
           OTP.create({
             userid:req.body.email,
             otp:Otp
           },function(err,data)
           {
             if(err)
             {
               console.log('error in creating the user otp');
               return ;
             }
             console.log('user otp is saved in data base successfully',data);
             res.render('otppage',{
               email:req.body.email,
               success_msg:false
             });
             return ;
           })

            
        }
        // res.redirect('back');
        // return ;
      }
    })
    
    // console.log(req.body);
    
  })
  app.post('/verifyotp',function(req,res)
  {
    OTP.findOne({email:req.query.email},function(err,otp)
    {
      if(err)
      {
        console.log('error in findin the user otp in database');
        return ;
      }
      if(otp && req.body.otp==otp.otp)
      {
         console.log('user registered successfully');
         OTP.findOneAndDelete({email:req.query.email},function(err)
         {
           if(err)
           {
             console.log('error in deleting the user');
             return ;
           }
           console.log('user otp is deleted successfully');
         });
         res.redirect('/login');
         return ;
      }
      // else if(otp && req.body.otp!=otp.otp)
      // {
      //   console.log('entered the worng otp');
      //   res.redirect('back');
      //   return ;
      // }
      else
      {
        console.log('email id does not exist');
        user.findOneAndDelete({email:req.query.email},function(err)
        {
          if(err)
          {
            console.log('error in deleting the user');
            return ;
          }
          console.log('user is deleted successfully');
          OTP.findOneAndDelete({email:req.query.email},function(err)
        {
          if(err)
          {
            console.log('error in deleting the user');
            return ;
          }
          console.log('user otp is also deleted successfully');
        })
        res.render('otppage',
        {
          email:false,
          success_msg:'You have entered the worng otp'
        });
        // res.redirect('');
        return ;

      })
    }
    // console.log(req.body.otp);
    // return res.redirect('/login');
  })
})
app.get('/forgotpassword',function(req,res)
{
  return res.sendFile(path.join(__dirname,'forgetpasswordpage.html'));
})
app.post('/passrecover',function(req,res){
    // console.log(req.body.email);
    user.findOne({email:req.body.email},function(err,User)
    {
      if(err)
      {
        console.log("error in finding the user in the databases");
        return ;
      }
      if(User)
      {
        var mailOptions = {
          from:'businessinfinty@gmail.com',
          to:User.email,
          subject:'Infinity Business',
          html:'<h1> ${User.name} this is your password </h1>'+ User.password + '<h1 style="color:red"></h1>'
        }
        transport.sendMail(mailOptions,function(err,info){
          if(err)
          {
              console.log('error in sending the mail');
              return;
          };
          console.log('mail is sent');
          res.redirect('login');
          return;
        });
      }
      else
      {
        res.redirect('signuppage');
        return ;
      }
      

    });
})
app.use(session({
  secret: 'infinitybusiness',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.listen(port,function(err)
{
    if(err)
    {
        console.log("Error in running the server");
        return ;
    }
    console.log("server is running on the port",port);
          return ;
});



app.get("/paywithpaytm", (req, res) => {
  console.log(req.query)
  const {subscriptiontype}=req.query
  let amt="99999999999999"
  if(subscriptiontype==="1"){
   amt = "999"
  }
  else if(subscriptiontype==="2"){
  amt = "129"
  }
  else{
    res.sendStatus(404);
    return;
  }
  
  initPayment(amt).then(
      success => {
          res.render("paytmRedirect.ejs", {

              resultData: success,
              paytmFinalUrl: process.env.PAYTM_FINAL_URL
          });
      },
      error => {
          res.send(error);
      }
  );
});

app.post("/paywithpaytmresponse", (req, res) => {
  console.log(req.body)
  responsePayment(req.body).then(
      success => {
          res.render("response.ejs", {resultData: "true", responseData: success});
      },
      error => {
          res.send(error);
      }
  );
});