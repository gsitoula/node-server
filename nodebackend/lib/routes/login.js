'use strict';
//var express = require('express');
var router  = require('express').Router();
//var session = require('express-session');
var crypto  = require('crypto');
var actDir  = require('activedirectory');
var config  = require('config');
var app = express();

var configAD =
{
	     url: 'ldap://' + config.adUrl,
	  baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
	username: config.username + '@' + config.domain,
	password: config.password
};
var ad = new actDir(configAD);

var hora = 3600000;
var dia  = hora*24;

app.use(session({
	cookie: {
		maxAge: dia
	},
	secret: '123456',
	resave: false,
	saveUninitialized: true,
}));

router.post('/login', function(req, res) {

	var username = req.body.username + "@" +config.domain;
	var userbase = req.body.username;
	var pass     = req.body.password;
	var hash     = crypto.createHash('md5').update(username+Date.now()).digest('hex');

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
		  /*Autenticacion fallida*/
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
		  		  	req.session.name = { token: hash, name: userbase };
		  		  	//console.log("Session generada en Login");
		  		  	console.log(req.session.user);
		  		  	res.status(200).send(req.session.user);  	
		          }	
		       });	
		      }
	         }
	      });	
});

module.exports = router;			   