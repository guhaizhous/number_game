module.exports={
	dbconfig:[ // db config infomation
		{			
			host: "127.0.0.1",
			user:"root",
			password:"",
			database:"mygame",
			port:3306,
			connectionLimit:1		
		}
	],
	gameTime:60, //game time
	dayTime:86400,
	redisHost:"127.0.0.1", //redis host ip
	redisPort:6379, //redis port 
	oneNo:2, // one number win multiple
	twoNo:3, // two number win multiple
	threeNo:10, // three number win multiple
	serverPort:3000 //project server port
}
