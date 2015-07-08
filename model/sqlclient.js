var mysql = require('mysql');
var config = require('../config.js');
var sqlclient =module.exports;
var _poolCluster=null;
var NND = {};


NND.init = function(){
  if(!_poolCluster){
    _poolCluster = mysql.createPoolCluster();
	for(var i=0;i<config.dbconfig.length;i++){
		_poolCluster.add(config.dbconfig[i].database,config.dbconfig[i]);
	}
  }
};

NND.query = function(db,sql, args, callback){
  _poolCluster.getConnection(db,function(err, client) {
    if (!!err) {
      console.error('[sqlqueryErr] '+err.stack);
      return;
    }
    client.query(sql,args,function(err, res) {
      //_poolCluster.releaseConnection(client);
	  client.release();
      callback.apply(null, [err, res]);
    });
  });
};

sqlclient.init=function(){
	 if (!!_poolCluster){
		return sqlclient;
	} else {
		NND.init();
		sqlclient.insert = NND.query;
		sqlclient.update = NND.query;
		sqlclient.deletes = NND.query;
		sqlclient.query = NND.query;
		return sqlclient;
	}
}

module.exports.getConn=function(db,cb){
	_poolCluster.getConnection(db,function(err, client) {
    if (!!err) {
      console.error('[sqlqueryErr] '+err.stack);
      return;
    }
    return cb(err,client);
  });
}