process.env.NODE_ENV = 'test';

var express = require('express')
  ,   app = express()
  , mod = require('../index')
  , router = require('../router')
  , bodyParser = require('body-parser')
  ;
  

app.use(bodyParser.json());

mod.registerApp(app);

app.get('/about', function(req, res){ 
	res.type('html').send("About Page").end(); 
});

app.get('/bio', function(req, res){ 
	res.type('html').send(res.locals.blurbs.biotext.rendered).end(); 
});


module.exports = app;
