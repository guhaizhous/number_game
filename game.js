var later = require('later');
later.date.localTime();
var conf = require("./config.js");
var log= require('./logconfig.js');
var myUtil = require('./myUtil.js');
var async = require('async');
var reSer= require("./model/service/results_service.js");
var reids = require('./model/service/redis_service.js');

var io;
var currTime =conf.gameTime;
var upReslut="- - -";
var currNo="1";

var Game = function(io){
	this.io =io;
	init();
}

var init=function(){  
    this.io.on('connection', function(socket){

	    socket.on('disconnect', function(){
	    	console.log(socket.id);
	    });

	    //socket.on("saveBet",function(msg){
	    //	console.log(msg,socket.id);
	    //});

	    socket.emit("connection",{msg:"connection Success!"}); 

    });	 
    //开始游戏
    start();
}

var start=function(){
	async.waterfall([
		function(cb){
			reids.get("qcNo",function(err,data){
				cb(err,data);
				console.log(err);
			});
		},
		function(data,cb){
			if(data===null || data===undefined){
				reids.set("qcNo",1);
			}
			cb(null,1);
		}
	  ],function(err,data){
	    if(err){
	      log.error("start error"+err);
	      return;
	    }else{
	      downTime();
	    }
	});
}

var downTime =function(){
	var check_sched = later.parse.recur().every(1).second(),
        check_t = later.setInterval(function() { 
        	this.currTime--;
        	if(this.currTime>=0){
            	this.io.sockets.emit("downTime",{times:this.currTime,numbers:this.upReslut,qcNo:this.currNo}); 
       		}else{
       			async.waterfall([
       				function (cb) { //出结果
       					var nostr=parseInt(9*Math.random())+","+parseInt(9*Math.random())+","+parseInt(9*Math.random());
       					cb(null,nostr);
       				},
       				function (nos,cb) {//取期次
       					var obj = {nos:nos,qcNo:''};
			       		reids.get("qcNo",function(err,qcNo){
			       			obj.qcNo=qcNo;
							cb(err,obj);
						});
       				},
       				function (obj,cb) {//期次处理
       					var newNo = parseInt(obj.qcNo)+1;
       					reids.set("qcNo",newNo);
       					obj.qcNo=newNo;
       					cb(null,obj);
       				},
       				function (obj,cb) {//保存结果
       					var dat = {perTime:parseInt(obj.qcNo)-1,numbers:obj.nos,state:"1",dateTimes:myUtil.getDay('yyyy-MM-dd hh:mm:ss')}
       					reSer.save(dat,function(err,data){
       						cb(err,obj);
       					});
       				}
       			],function(err,data){//发送消息
       				if(err){
       					log.error("downTime error"+err);
       					return;
       				}
       				this.io.sockets.emit("gameOpen",{numbers:data.nos}); 
					this.currTime =conf.gameTime;
					this.upReslut= data.nos;
					this.currNo= data.qcNo;
       			});	
       		}
    }, check_sched);
}

module.exports=Game;