process.env.NODE_ENV = 'test';

var express = require('express')
  ,   app = express()
  , mod = require('../index')
  , router = require('../router')
  , bodyParser = require('body-parser')
  ;
  

app.use(bodyParser.json());

mod.registerApp(app);

app.listen(3001);

module.exports = app;

