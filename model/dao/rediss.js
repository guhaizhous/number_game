var client = require('../redisconn.js');

module.exports.get=function(key,cb){
	client.get(key, function (err, reply) { 		
        cb(err,reply);    	
    });
}

module.exports.set=function(key,value){
	client.set(key,value);
}