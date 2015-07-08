var conf = require('../config.js');
var redis = require("redis");
var client = redis.createClient(conf.redisPort,conf.redisHost,{}); 

client.on("error", function (err) {  
    console.log("redis conn error " + err);  
});

module.exports=client;