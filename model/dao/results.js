var MySqlTemplate =require('../mysqlTemplate.js');
var config =require('../../config.js');
var sqlTempl = new MySqlTemplate({});
var db =config.dbconfig[0].database;

module.exports.save=function(obj,cb){
	var table = db +".results";
	var columns=['perTime','numbers','state','dataTimes'];
	var args =[obj.perTime,obj.numbers,obj.state,obj.dateTimes];
	sqlTempl.insert(db,table,columns,args,cb);
}

module.exports.query=function(obj,cb){
	var sql="select Id,perTime,numbers,state,dataTimes from "+db+".results where perTime='" + obj.perTime +"'";
	sqlTempl.queryBySQL(db,sql,cb);
}

module.exports.update=function(obj,cb){
	var sql="update "+db+".results set numbers='"+ obj.numbers +"' where perTime='" + obj.perTime +"'";
	sqlTempl.queryBySQL(db,sql,cb);
}

module.exports.checkDay=function(dateTimes,cb){
	var sql="select  perTime from "+db+".results where dataTimes='"+dateTimes+"'";
	sqlTempl.queryBySQL(db,sql,cb);
}