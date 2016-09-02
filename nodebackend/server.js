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
//var genuuid = require('uid-safe');
var crypto = require('crypto');
var actDir  = require('activedirectory');
var cors = require('cors');
//var MemoryStore = require('session-memory-store')(session);
//var RedisStore = require('connect-redis')(session);
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cardinal');

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

console.log(session.Store);

var hora = 3600000;
var dia  = hora*24;

app.use(session({
	secret: '123456',
	cookie: {
		maxAge: dia
	},
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 60*10 })
}));

var configAD =
{
	     url: 'ldap://' + config.adUrl,
	  baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
	username: config.username + '@' + config.domain,
	password: config.password
};
var ad = new actDir(configAD);

/*
app.all('*',function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.109:9009');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});*/

var sess;

app.post('/login', function(req, res) {
	sess = req.session;
	var username = req.body.username + "@" + config.domain;
	var userbase = req.body.username;
	var pass     = req.body.password;
	var hash     = crypto.createHash('md5').update(username+Date.now()).digest('hex');
	sess.user = {token: hash, name: userbase};
	res.status(200).send(sess.user);
});

app.get('/userSession', function(req, res) {
	console.log(sess.id);
	res.status(200).send(sess.user);	
});

var port = process.env.PORT || config.port || 3000;

app.listen(port, function() {
  console.log('Ejecutando en el puerto ' + port);
});
