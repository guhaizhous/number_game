var MySqlTemplate =require('../mysqlTemplate.js');
var config =require('../../config.js');
var sqlTempl = new MySqlTemplate({});
var db =config.dbconfig[0].database;

module.exports.save=function(obj,cb){
	var table = db +".userinfo";
	var columns=['userNo','userPwd'];
	var args =[obj.userNo,obj.userPwd];
	sqlTempl.insert(db,table,columns,args,cb);
}

module.exports.update=function(obj,cb){
	var sql ="";
	if(obj.types==="bet"){
	  sql =" update "+ db +".userinfo set tot=tot-"+obj.tot+"  where Id='" + obj.Id +"'";
	}else if(obj.types==="dj"){
	  sql =" update "+ db +".userinfo set tot=tot+"+obj.tot+"  where Id='" + obj.Id +"'";
	} 
	if(sql===""){
		return cb(new Error({code:0,msg:"sql is null"}),rows);
	}
	sqlTempl.updateBySQL(db,sql,cb);
}

module.exports.query=function(obj,cb){
	var sql="select Id,userNo,userPwd,tot  from "+db+".userinfo where userNo='" + obj.userNo +"'";
	sqlTempl.queryBySQL(db,sql,cb);
}

module.exports.login=function(obj,cb){
	var sql="select Id,userNo,userPwd,tot  from "+db+".userinfo where userNo='" + obj.userNo +"' and userPed ='"+ obj.userNo +"'";
	sqlTempl.queryBySQL(db,sql,cb);
}