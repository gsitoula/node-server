'use strict';

var router  = require('express').Router();
var crypto  = require('crypto');
var actDir  = require('activedirectory');
var config  = require('config');


router.get('/userSession', function(req, res) {
	//res.status(200).send(req.session.user);
	if(req.session.user.name === req.param('name')){
			res.status(200).send(req.session.user);
	}
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

module.exports = router;