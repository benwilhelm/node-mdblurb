process.env.NODE_ENV = 'test';
require('../Blurb');
var async = require('async')
  , app = require('./_test-server')
  , express = require('express')
  , fixtures = require('pow-mongoose-fixtures')
  , mongoose = require('mongoose')
  ,   Blurb = mongoose.model('Blurb')
  , request = require('supertest')
  , should = require('should')
  , theModule = require('../index')
  ;

describe('Middleware', function(){

  var suite = this;

  before(function(done){
    async.series([
      function(cb) { mongoose.connection.collections.blurbs.remove({}, cb); },
      function(cb) { fixtures.load('./_fixtures.js', mongoose.connection, cb); },
      function(cb) {
        suite.fixtures = require('./_fixtures').Blurb;
        Blurb.findOne({path:'/about'}, function(err, blurb) {
          suite.blurb = blurb;
          cb(err, blurb);
        });
      }
    ], done);
  })


  it('should load associated blurbs into response object when loading a page', function(done){
    
    var testBlurb = new Blurb(suite.fixtures.bio_biotext);

    request(app)
    .get('/bio')
    .end(function(err, res){
      res.text.should.eql(testBlurb.render(true))
      done();
    });
  });

  it('Optional auth middleware should restrict access to POST /', function(done){

    var app = express();
    theModule.registerApp(app, {
      auth: function(req, res, next) {
        req.canEditBlurb = false
        next();
      }
    });

    request(app)
    .post('/blurb')
    .expect(401)
    .end(done);
  })

  it('Optional auth middleware should restrict access to PUT /:blurb_id', function(done){

    var app = express();
    theModule.registerApp(app, {
      auth: function(req, res, next) {
        req.canEditBlurb = false;
        next();
      }
    });

    request(app)
    .put('/blurb/' + suite.blurb._id)
    .expect(401)
    .end(done);
  })

  it('Optional auth middleware should restrict access to DELETE /:blurb_id', function(done){

    var app = express();
    theModule.registerApp(app, {
      auth: function(req, res, next) {
        req.canEditBlurb = false;
        next();
      }
    });

    request(app)
    .delete('/blurb/' + suite.blurb._id)
    .expect(401)
    .end(done);
  })

  it('Optional auth middleware should allow access to GET /:blurb_id', function(done){

    var app = express();
    theModule.registerApp(app, {
      auth: function(req, res, next) {
        req.canEditBlurb = false;
        next();
      }
    });

    request(app)
    .get('/blurb/' + suite.blurb._id)
    .expect(200)
    .end(done);
  });

});