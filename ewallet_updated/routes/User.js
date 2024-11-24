var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require("mongoose");
var session = require('express-session');
let User_Schema =require("../models/User_Schema");
let Transaction_Schema =require("../models/Transaction_Schema");

router.get('/',function(req,res)
{
    res.render('index',{msg:""});
});
router.post('/register',function(req,res)
{
    const data1 = new User_Schema({
        name: req.body.name,
        phone: req.body.phone,
        password:req.body.password,
        });
    const data2 = new Transaction_Schema({
            phone: req.body.phone,
            details:"new account create",
            amount:"50",
            type:"Cr",
            wallet:"50",
            });
    
        User_Schema.findOne({ phone: data1.phone })
          .then(exist => {
            if (exist) {
                //res.send("Email Already Exist");
                res.render('index',{msg:"Phone Already Exist"});  //views/Foldername/file
            } else {
                User_Schema.create(data1);
                Transaction_Schema.create(data2);
                //res.send("Inserted successfully done");
                res.render('index',{msg:"Registration successfully done"});
            }
          })
          .catch(error => {
            console.error('Error finding user:', error);
          });
});
router.post('/login',function(req,res)
{
    const data1 = new User_Schema({
        phone: req.body.phone,
        password:req.body.password,
        });
    
        User_Schema.findOne({ phone: data1.phone,password:data1.password })
          .then(exist => {
            if (exist) {
                
              req.session.user=data1.phone;
              res.redirect('/profile');

            } else {
              res.render('index',{msg:"invalid login details"});
            }
          })
          .catch(error => {
            console.error('Error finding user:', error);
          });
});
router.get('/profile',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    var data4=await Transaction_Schema.find({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('profile',{msg:"",data2:data2,data3:data3,data4:data4});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.get('/addmoney',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('addmoney',{msg:"",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.post('/addmoney',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    const data4 = new Transaction_Schema({
      phone: usr,
      details:"Money Added From Credit Card"+"xxxxxxxx"+req.body.details1.substring(req.body.details1.length-4,req.body.details1.length),
      amount:req.body.amount,
      type:"Cr",
      wallet:(parseInt(data3.wallet)+parseInt(req.body.amount)).toString(),
      });
      Transaction_Schema.create(data4);
    res.render('addmoney',{msg:"money added successfully",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.get('/sendmoney',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('sendmoney',{msg:"",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.post('/sendmoney',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    
    var data21=await User_Schema.findOne({phone:req.body.phone});
    if(data21)
    {
      if(parseInt(data3.wallet)>parseInt(req.body.amount))
      {
            const data4 = new Transaction_Schema({
              phone: usr,
              details:"Money credited  to "+req.body.phone+","+req.body.details1,
              amount:req.body.amount,
              type:"Dr",
              wallet:(parseInt(data3.wallet)-parseInt(req.body.amount)).toString(),
              });
              Transaction_Schema.create(data4);

              var data31=await Transaction_Schema.findOne({phone:req.body.phone},null,{ sort: { createdAt: -1 } });
              const data41 = new Transaction_Schema({
                phone: req.body.phone,
                details:"Money debited  from "+usr+","+req.body.details1,
                amount:req.body.amount,
                type:"Cr",
                wallet:(parseInt(data31.wallet)+parseInt(req.body.amount)).toString(),
                });
                Transaction_Schema.create(data41);
            res.render('sendmoney',{msg:"money added successfully",data2:data2,data3:data3});
      }
      else
      {
        res.render('addmoney',{msg:"insufficient balance",data2:data2,data3:data3});
      }
    }
    else
    {
      res.render('sendmoney',{msg:"receipent not found",data2:data2,data3:data3});
    }
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});

router.get('/mobile',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('mobile',{msg:"",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.post('/mobile',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    
    
      if(parseInt(data3.wallet)>parseInt(req.body.amount))
      {
            const data4 = new Transaction_Schema({
              phone: usr,
              details:"mobile rechage successfully done to"+req.body.phone+", operator:"+req.body.details1,
              amount:req.body.amount,
              type:"Dr",
              wallet:(parseInt(data3.wallet)-parseInt(req.body.amount)).toString(),
              });
              Transaction_Schema.create(data4);

            res.render('mobile',{msg:"mobile recharge successfully done",data2:data2,data3:data3});
      }
      else
      {
        res.render('mobile',{msg:"insufficient balance",data2:data2,data3:data3});
      }

  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.get('/electric',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('electric',{msg:"",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.post('/electric',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    
    
      if(parseInt(data3.wallet)>parseInt(req.body.amount))
      {
            const data4 = new Transaction_Schema({
              phone: usr,
              details:"electric bill successfully done to consumerID:"+req.body.phone+", provider:"+req.body.details1,
              amount:req.body.amount,
              type:"Dr",
              wallet:(parseInt(data3.wallet)-parseInt(req.body.amount)).toString(),
              });
              Transaction_Schema.create(data4);

            res.render('electric',{msg:"electric bill recharge successfully done",data2:data2,data3:data3});
      }
      else
      {
        res.render('electric',{msg:"insufficient balance",data2:data2,data3:data3});
      }

  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.get('/movie',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    res.render('movie',{msg:"",data2:data2,data3:data3});
  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.post('/movie',async function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    
    var data2=await User_Schema.findOne({phone:usr});
    var data3=await Transaction_Schema.findOne({phone:usr},null,{ sort: { createdAt: -1 } });
    
    
      if(parseInt(data3.wallet)>parseInt(req.body.amount))
      {
            const data4 = new Transaction_Schema({
              phone: usr,
              details:"movie ticket book successfully moviename:"+req.body.details1+", theater:"+req.body.details2+" no of ticket:"+req.body.details3+" Date:"+req.body.details4+" Time:"+req.body.details5,
              amount:req.body.amount,
              type:"Dr",
              wallet:(parseInt(data3.wallet)-parseInt(req.body.amount)).toString(),
              });
              Transaction_Schema.create(data4);

            res.render('movie',{msg:"movie ticket book successfully done",data2:data2,data3:data3});
      }
      else
      {
        res.render('movie',{msg:"insufficient balance",data2:data2,data3:data3});
      }

  }
  else
  {
    res.render('index',{msg:"please login first"});
  }
});
router.get('/logout',function(req,res)
{
  var usr=req.session.user;
  if(usr)
  {
    req.session.user="";
    res.render('index',{msg:"successfully logout"});
  }
  else
  {
    res.render('index',{msg:"already logged out"});
  }
});

module.exports = router;