var user =require('../dao/userinfo.js');

module.exports.save=function(obj,cb){
	user.update(obj,function(err,data){
		if(err){
			return cb(err,null);
		}
		if(data.affectedRows===0){
			return user.save(obj,cb);
		}else{
			return cb(err,data);
		}
	});
}

module.exports.query=function(obj,cb){
	user.query(obj,cb);
}

module.exports.update=function(obj,cb){
	user.update(obj,cb);
}


module.exports.login=function(obj,cb){
	user.query(obj,cb);
}