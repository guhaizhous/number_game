var express = require('express');
var router = express.Router();
var log= require('../logconfig.js');
var fs = require('fs'); 
var user = require("../model/service/userinfo_service.js");
var redis = require("../model/service/redis_service.js");
var order = require("../model/service/orders_service.js");
var myUtil =require("../myUtil.js");
var async = require('async');

/* GET home page. */
router.get('/', function(req, res){
  res.render('login', { title: 'number game' });
});
 

router.post('/index', function(req, res) {
  var userNo =req.body.userNo;
  var userPwd =req.body.userPwd;
  req.session.userNo =userNo;
  if(userNo==="" || userPwd===""){
  	res.render('error', { error:"Enter a user name and password"});
  	return;
  } 

  var obj ={userNo:userNo,userPwd:userPwd};
  user.login(obj,function(err,data){
  	if(err){
  	   res.render('error', { error:"Enter a user name and password"});
       log.error("[router.post /index user.login]"+err);
  	   return;
  	}
  	if(data.length>0){
      req.session.userId =data[0].Id;
	    res.render('index', {title:"number of game",userNo:userNo,userTot:data[0].tot});
	}else{
	   res.render('error', { error:"User name and password error"});
	}
  });
});
 

router.post('/inserBet', function(req, res){
  var obj={
    perTime:'',
    userNo:req.session.userId,
    sn:req.session.userId+""+ new Date().getTime(),
    numbers:req.body.innumbers,
    tot:req.body.tot,
    dateTimes:myUtil.getDay("yyyy-mm-dd hh:mm:ss")
  };

  if(req.session.userId === undefined ||req.session.userId.length===0){
     res.redirect('/');
     return;
  }

  if(obj.numbers===null || obj.tot===null ){
    res.json({code:0,msg:"Please enter a number or amount！"});
    return;
  }
  
  async.waterfall([
      function(cb){
        redis.get("qcNo",function(err,data){
          obj.perTime=data;
          cb(err,obj);
        });
      },
      function(obj,cb){
        order.saveBet(obj,function(err,data){
          cb(err,obj);
        });
      }
    ],function(err,data){
      if(err){
        res.json({code:0,msg:"submit error!,Please rest submit!"+err});
        log.error("[router.post /inserBet user.login]"+err);
        return;
      }else{
        res.json({code:1,msg:"Betting success!",tot:data.tot});
        return;
      }
  });
});

router.post('/getReslut',function(req,res){
  var perTime= req.body.qcNo;
  var userId = req.session.userId;
  if(req.session.userId === undefined ||req.session.userId.length===0){
     res.redirect('/');
     return;
  }
  if(perTime==="" || perTime===undefined){
    res.json({code:0,msg:"get reslut error!"});
    return;
  }
  var obj ={perTime:perTime,userId:userId};
  
  async.waterfall([
      function(cb){
        order.djQuery(obj,function(err,data){
          cb(err,data);            
        });
      },
      function(data,cb){//修改用户余额
        var wimTot =0;
        for (var i = 0; i < data.length; i++) {
          wimTot+= data[i].tot * data[i].multiple;
        };
        var obj= {Id:req.session.userId,tot:wimTot,types:"dj"};
        user.update(obj,function(err,rows){
          cb(err,data);
        });
      }
    ],function(err,data){
        if(err){
          res.json({code:0,msg:"get reslut error!"+err});
          return;
        }
        
        res.json({code:0,msg:"get reslut ok!",data:data});
        return;
  });
});

module.exports = router;
