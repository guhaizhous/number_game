/*var start=function(){
	var num = parseInt(conf.dayTime/conf.gameTime)+2;
	var dateTimes =myUtil.getDay();
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
		},
	    function(data,cb){
	      //检查是否有生成路单
	      reSer.checkDay(dateTimes,function(err,data){
	        cb(err,data)
	      });
	    },
	    function(data,cb){
	      //没有生成则重新生成
	      if(data.length===0){
	        reSer.initResult(num,function(err,data){
	            cb(err,data)
	        });
	      }
	      cb(null,data);
	    }
	  ],function(err,data){
	    if(err){
	      console.log("初始化路单失败!,服务将不启动S");
	      return;
	    }else{
	      downTime();
	    }
	});
}
var a ='1,2,3';
var b='9'
console.log(a.indexOf(b));
*/
var res =[];
for (var i = 1; i <=6; i++) {
	for (var n = i; n <=6; n++) {		
		for (var s = n; s <= 6; s++) {
 			console.log(i+","+n+","+s);
 			res.push([i,n,s]);
		}; 
		
	};
};
console.log(res)
