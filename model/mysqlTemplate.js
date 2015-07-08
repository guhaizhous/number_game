var sqlclient = require('./sqlclient.js').init();

function MySqlTemplate(){};

module.exports = MySqlTemplate;

/*
应用实例
var table ='SW_USER';
var columns=['UID','USER_NO','USER_PWD','NICK_NAME','SEX','HEAD_IMG_URL'];
var args =['3','fdfd','fdfdsf','test','1'];
sqlTempl.insert(table,columns,args,function(err,rows){
	console.log("==222rows==="+rows);
	console.log("==222err==="+err);
});
*/
MySqlTemplate.prototype.insert = function insert(db,table,columns,args,callback){
	var param='';
	if(columns!=null && args!=null && columns!=undefined && args!=undefined
		&& columns.length>0 && columns.length === args.length){

		for(var i=0;i<columns.length;i++){
			param=param+',?';
		}
	
		var sql = "INSERT INTO "+table+"("+columns.toString()+")VALUES ("+ param.substring(1,param.length) +")";
		console.log(sql);
		sqlclient.insert(db,sql,args,function(err,rows){	
			callback(err,rows);
		});
	}else{
		 var err = new Error('Parameters are inconsistent with the field!');
		 var rows;
		 callback(err,rows);
	}
};


/*
第一种查询方式
用例，参数columns 为var columns;其它参数没有传null
var table ="表名"
var columns=['UID','OPEN_ID','NICK_NAME'];  显示的字段
var selection =' UID = ? AND OPEN_ID = ?'; 条件
var selectionArgs=['1','o01EluMamLfWnUS1HCY5Dsaduq9w']; 条件 ？值
var groupBy =' group by OPEN_ID'; 分组查询
var having=' HAVING count(OPEN_ID) < 2'; //与gorup by分组一起用，查询open_id出现次数小余2的
var orderBy =' orderBy OPEN_ID desc';排序
var limit =' limit 0,20'; 分页
newuser.query('test',columns,selection,selectionArgs,groupBy,having,orderBy,limit,function(err,rows){
	//TODO
});

*/
MySqlTemplate.prototype.query =function query(
	   db,table,columns,selection,
	   selectionArgs,groupBy,
	   having,orderBy,limit,callback){
	var agrs;
	var sql ="SELECT "+ (columns===undefined ? '*' : columns.toString()) +" FROM "+table+" ";
	if(selection!=null){
		sql=sql+ " WHERE "+ selection ;
	}
	
	if(selectionArgs!=null)agrs=selectionArgs;

	if(groupBy!=null) sql = sql + groupBy;	

	if(having!=null) sql = sql + having;	
	
	if(orderBy!=null) sql = sql + orderBy;
	
	if(limit!=null) sql =sql + limit; 
	//console.log(agrs[0] );
	sqlclient.query(db,sql,agrs,function(err,rows){
		return callback(err,rows);
	});	
};

/**第二种查询方式
** params :
   sql 完整的sql语句
   callback 回调函数 
*/
MySqlTemplate.prototype.queryBySQL=function queryBySQL(db,sql,callback){
	var agrs;
	sqlclient.query(db,sql,agrs,function(err,rows){
		return callback(err,rows);
	});	
};

/*
第一种删除方式
*/
MySqlTemplate.prototype.deleteBySQL = function deleteBySQL(db,sql,callback){
	var agrs;
	sqlclient.query(db,sql,agrs,function(err){
		return callback(err);
	});
};

/*
第二种删除方式
*/
MySqlTemplate.prototype.deletes = function deletes(db,table,selection,
												selectionArgs,callback){
	var sql = "DELETE FROM "+table;
	var args;
	if(selection!=null) sql=sql+ " WHERE "+ selection;
	
	if(selectionArgs!=null) args=selectionArgs;
	console.log("delete== ="+sql);
	sqlclient.deletes(db,sql,args,function(err){
		return callback(err);
	});
};

//第一种更新方式
MySqlTemplate.prototype.update =  function update(db,table,columns,selection,selectionArgs,callback){
	
	var args;
	var sql = "UPDATE "+table+" SET " + columns.toString() ;
	if(selection!=null && selectionArgs!=null){		
		    sql=sql+ " WHERE " + selection;
			args =selectionArgs;
	}
	sqlclient.update(db,sql,args,function(err,rows){
		return callback(err,rows);
	});
};

//第二种更新方式
MySqlTemplate.prototype.updateBySQL =  function updateBySQL(db,sql,callback){	
	var args;
	sqlclient.update(db,sql,args,function(err,rows){
		console.log(err);
		console.log(rows);
		return callback(err,rows);
	});
};

//取UID
MySqlTemplate.prototype.getUid =function getUid(db,nameValue,callback){
	var sql ="INSERT INTO sequence(name) VALUES('"+nameValue+"') ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id + 1)";
	var args;
	sqlclient.insert(db,sql,args,function(err,rows){
		if(err){
			console.log('[SQL insert uid error]:'+err.message);
			return;
		}
		var ssql ="SELECT * FROM sequence where name='"+nameValue+"'";
		var args;
		sqlclient.query(db,ssql,args,function(err,rows){
			if(err){
				console.log('[SQL select uid error]:'+err.message);
				return;
			}
			callback(err,rows);
		});
	});
};

MySqlTemplate.prototype.getConn =function getConn(db,cb){
	return sqlclient.getConn(db,cb);
}