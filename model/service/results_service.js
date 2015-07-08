var results =require('../dao/results.js');
var myUtil =require("../../myUtil.js");
module.exports.save=function(obj,cb){
	results.save(obj,cb);
}

module.exports.query=function(obj,cb){
	results.query(obj,cb);
}

module.exports.update=function(obj,cb){
	results.update(obj,cb);
}


module.exports.checkDay=function(dateTimes,cb){
	results.checkDay(dateTimes,cb);
}

//初始化游戏结果
module.exports.initResult=function(number,cb){
	createResult(number,cb);
}


function createResult(number,cb){
	var nostr=parseInt(9*Math.random())+","+parseInt(9*Math.random())+","+parseInt(9*Math.random());
	console.log(nostr)
	var dateValue=myUtil.getDay();
	console.log(dateValue)
	var obj ={perTime:number,numbers:nostr,state:'0',dateTimes:dateValue};
	results.save(obj,function(err,data){
		if(err){
			return cb(err,null);
		}
		number--;
		if(number===0){
			return cb(err,data); 
		}else{
			return createResult(number,cb);
		}		
	});
}