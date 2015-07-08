var rediss =require('../dao/rediss.js');

module.exports.get=function(key,cb){
	rediss.get(key, function (err, reply) {
        cb(err,reply)
    });
}

module.exports.set=function(key,value){
	rediss.set(key,value);
}