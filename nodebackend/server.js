'use strict';

var express = require('express');
var session = require('express-session');
var morgan  = require('morgan');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var config = require('config');
var path = require('path');
var cookieParser = require('cookie-parser');
//var login = require('./lib/routes/login.js');
//var get   = require('./lib/routes/get.js');
var genuuid = require('uid-safe');
var crypto = require('crypto');
var actDir  = require('activedirectory');
var cors = require('cors');
var MemoryStore = require('session-memory-store')(session);

var app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '10mb'
}));
app.use(cookieParser());

var hora = 3600000;
var dia  = hora*24;

console.log(genuuid(1))

app.use(session({
	genid: function(req){
	return genuuid(18) },
	secret: '123456',
	cookies: {maxAge: dia},
	store: MemoryStore({expires: 60*60, checkperiod: 10*60})
}));

var sess;

var configAD =
{
	     url: 'ldap://' + config.adUrl,
	  baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
	username: config.username + '@' + config.domain,
	password: config.password
};
var ad = new actDir(configAD);


app.all('*',function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.109:9009');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.post('/login', function(req, res) {
	
	sess = req.session;
	var username = req.body.username + "@" + config.domain;
	var userbase = req.body.username;
	var pass     = req.body.password;
	var hash     = crypto.createHash('md5').update(username+Date.now()).digest('hex');
	req.session.user = {token: hash, name: userbase};
	sess.user = {token: hash, name: userbase};
	console.log(sess.sessionID);
	res.status(200).send(sess.user);
	
	/*	
	ad.authenticate(username, pass, function(err, auth){
		if(err)
	  {
		console.dir(err);
		res.status(501).json({err: true, descripcion: "ha ocurrido un error", mensaje: err})
	  }
		else
	  {	
		  if(!auth)
	    {
		  
		  res.status(501).send({err: 1, descripcion: "ha ocurrido un error durante la autenticacion de sus credenciales"})
		}	
		  else
		{
		  //console.log(auth);
		  ad.getGroupMembershipForUser(userbase, function(err, groups) {
		  		  if(err)
		  		{
		  			console.log('ERROR: ' +JSON.stringify(err));
		  			return;
		  		}
		  		    if(!groups)
		  		  {
		  		  	console.log('User: ' + username + "not found.");
		  		  }
		  		    else
		  		  {		  		  		
		  		  	var first_perfil = groups[0].cn;
		  		  	req.session.user = { token: hash, name: userbase };
		  		  	//console.log("Session generada en Login");
		  		  	console.log(req.session.user);
		  		  	res.status(200).send(req.session.user);  	
		          }	
		       });	
		      }
	         }
	      });*/	
});

app.get('/userSession', function(req, res) {
	console.log(sess.sessionID);
	console.log(sess);
	res.status(200).send(sess.user);
	
	//console.log(req.session.user);
	/*
	if(req.session.user.name === req.param('name')){
			res.status(200).send(req.session.user);
	}*/
	/*
	  var findPerfil = function(perfil){
				var db = mongoose.connection;

			function find(collec, query, callback){
		  		mongoose.connection.db.collection(collec, function(err, collection) {
		  			collection.find(query).toArray(callback);
		      });
			};
		
			find('perfils', {name: perfil}, function(err, docs) {
		  		  		
		  	docs.forEach(function(currentValue) {
		  		  if(currentValue.name === perfil)
		  		{	
		  		  //console.log(docs);
		  		  var user_data = { appDisp: currentValue.appDisp };
		  		  res.status(200).json(user_data);	
		  		}	
		 	  });
	  	    }); 	
	      }
	  //findPerfil(req.session.username.perfil);	


	  //console.dir(req.session.user);	
	  //console.log(req.session.user.token);
	  //console.log("token desde frontend: " + req.param("token"));		
	/*
	  if(!req.session.username)
	{	
		console.log("No encuentra la session");		
		res.status(501).send({err: 49, descripcion: "Sesion Caduca"});
	}
	  else
	{
		  if(req.session.username.token !== req.param("token"))
		{
			res.status(401).send({err: 1, descripcion: "Autenticidad de Token Invalida"});
		}
		  else
		{	
			
			console.log("Session encontrada en get");
			//res.status(200).send("Bienvenido " + req.session.user.perfil);
			
			var findPerfil = function(perfil){
				var db = mongoose.connection;

			function find(collec, query, callback){
		  		mongoose.connection.db.collection(collec, function(err, collection) {
		  			collection.find(query).toArray(callback);
		      });
			};
		
			find('perfils', {name: perfil}, function(err, docs) {
		  		  		
		  	docs.forEach(function(currentValue) {
		  		  if(currentValue.name === perfil)
		  		{	
		  		  //console.log(docs);
		  		  var user_data = { appDisp: currentValue.appDisp };
		  		  res.status(200).json(user_data);	
		  		}	
		 	  });
	  	    }); 	
	      }
			findPerfil(req.session.username.perfil);
			//console.log(req.session.user);
		
		}    	
	}*/  	
	
});
/*
router.get('/getSessionByToken', function(req, res) {
	console.log(req.session);
	res.status(200).send(req.session.user);
});*/

//Routes
//app.use('/', login);
//app.use('/', get);

var port = process.env.PORT || config.port || 3000;

app.listen(port, function() {
  console.log('Ejecutando en el puerto ' + port);
});
