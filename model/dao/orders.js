var async = require('async');
var MySqlTemplate =require('../mysqlTemplate.js');
var config =require('../../config.js');
var sqlTempl = new MySqlTemplate({});
var db =config.dbconfig[0].database;

module.exports.save=function(obj,cb){
	var table = db +".order";
	var columns=['perTime','userNo','sn','numbers','tot','dateTimes'];
	var args =[obj.perTime,obj.userNo,obj.sn,obj.numbers,obj.tot,obj.dateTimes];
	console.log(args);
	sqlTempl.insert(db,table,columns,args,cb);
}

module.exports.update=function(obj,cb){
	var sql =" update "+ db +".order set state='"+obj.state+"'  where sn='" + obj.sn +"'"; 
	sqlTempl.updateBySQL(db,sql,cb);
}

module.exports.query=function(obj,cb){
	var sql="select Id,perTime,userNo,sn,numbers,state,dateTimes,tot  from "+db+".order where userNo='" + obj.userId +"' and perTime ='"+obj.perTime+"'";
	console.log(sql);
	sqlTempl.queryBySQL(db,sql,cb);
}

//先存用户下注信息   
//再修改用户金额
module.exports.saveBet=function(obj,cb){
	var insertSql = "insert into "+ db +".order(perTime,userNo,sn,numbers,tot,dateTimes)values('"+obj.perTime+"','"+obj.userNo+"','"+obj.sn+"','"+obj.numbers+"',"+obj.tot+",'"+obj.dateTimes+"') ";
	var updateSql = "update "+ db +".userinfo set tot=tot-"+obj.tot+"  where Id='" + obj.userNo +"'";
	sqlTempl.getConn(db,function(err,conn){
		conn.beginTransaction(function(err){
			if(err){
			  return cb(err,null);
			}
			conn.query(insertSql,function(err,rows){
				if(err){
					conn.rollback(function(err){
						return cb(err,null);
					});
				}
				conn.query(updateSql,function(err,rows){
					if(err){
						conn.rollback(function(err){
							return cb(err,null);
						});
					}
					conn.commit(function(err) {  
						if(err){
							conn.rollback(function(err){
								return cb(err,null);
							});
						}
						conn.release();
						return cb(err,null);
					});
				});
			});
		}); 

		/*
		async.series([ 
			function(cb){//存用户下注信息 
				conn.query(insertSql,function(err,rows){
					cb(err,rows);
				});
			},function(cb){//修改用户金额
				conn.query(updateSql,function(err,rows){
					cb(err,rows);
				});
			}
		],function(err,results){
			if (err) {				
                conn.rollback();
            } else {  
                conn.commit(); 
            }  
            cb(err,results); 
            conn.release();
		});*/
	});
}
