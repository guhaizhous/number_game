var orders =require('../dao/orders.js');
var result =require('../dao/results.js');
var conf = require('../../config.js');
var async = require('async');
module.exports.save=function(obj,cb){
	return _save(obj,cb);
}

var _save = function(obj,cb){
	orders.save(obj,cb);
}

module.exports.query=function(obj,cb){
	return _query(obj,cb);
}

var _query =function(obj,cb){
	orders.query(obj,cb);
}

module.exports.update=function(obj,cb){
	orders.update(obj,cb);
}

module.exports.saveBet=function(obj,cb){
	orders.saveBet(obj,cb);
}

module.exports.djQuery=function(obj,cb){
	async.waterfall([
		function(cb){//用户订单
			_query(obj,function(err,data){
				cb(err,data);
			});
		},	
		function(orderData,cb){//当期结果
			result.query(obj,function(err,data){
				cb(null,orderData,data);
			});
		},function(orderData,resultData,cb){//计算中奖号码及金额
			var dataList=[];
			var index=0;
			for (var i = 0; i < resultData.length; i++) {
				for (var n = 0; n < orderData.length; n++) {
					if(orderData[n].perTime===resultData[i].perTime) {
						if (resultData[i].numbers.indexOf(orderData[n].numbers)>=0){
							var multiple=0;
							if(orderData[n].numbers.replace(",","").length===1){
								multiple=conf.oneNo;
							}else if(orderData[n].numbers.replace(",","").length===2){
								multiple=conf.twoNo;
							}else if(orderData[n].numbers.replace(",","").length===3){
								multiple=conf.threeNo;
							}
							dataList[index]={numbers:orderData[n].numbers,tot:orderData[n].tot,multiple:multiple};
							index++;
						}
					}
				};
			};
			cb(null,dataList);
		}
	],function(err,data){
		return cb(err,data);
	});
}          
