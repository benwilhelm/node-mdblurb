process.env.NODE_ENV = 'test';
require('../Blurb');
var async = require('async')
  , app = require('./_test-server')
  , fixtures = require('pow-mongoose-fixtures')
  , mongoose = require('mongoose')
  ,   Blurb = mongoose.model('Blurb')
  , request = require('supertest')
  , should = require('should')
  ;


describe('Routes', function(){

  var suite = this;
  
  before(function(done){
    async.series([
      function(cb) { mongoose.connection.collections.blurbs.remove({}, cb); },
      function(cb) { fixtures.load('./_fixtures.js', mongoose.connection, cb); },
      function(cb) {
        Blurb.findOne(function(err, blurb) {
          suite.blurb = blurb;
          cb(err, blurb);
        });
      }
    ], done);
  })
  
  it('GET /:blurb_id should return blurb with MD and html if found', function(done){
    var url = "/blurb/" + suite.blurb._id;
    request(app)
    .get(url)
    .end(function(err, res){
      should(err).be.null;
      res.status.should.eql(200);
      res.body.blurb.text.should.eql("#Heading 1#\n\nThis is text.")
      res.body.blurb.html.should.eql("<h1>Heading 1</h1>\n\n<p>This is text.</p>");
      done();
    })
  });

  it('GET /:blurb_id should return 404 if not found', function(done){
    request(app)
    .get('/blurb/bad_id')
    .expect(404)
    .end(done);
  });
  
  it('POST / should create new blurb', function(done){
    var data = {
      text: '#foo#',
      path: '/bar',
      hash: 'bif'
    }
    
    request(app)
    .post('/blurb')
    .send(data)
    .end(function(err, res){
      res.status.should.eql(200);
      res.body.blurb.text.should.eql('#foo#');
      res.body.blurb.html.should.eql('<h1>foo</h1>');
      res.body.blurb._id.should.match(/^[\w\d]{24}$/);
      
      Blurb.findOne({_id:res.body.blurb._id}, function(err, blurb){
        blurb.text.should.eql('#foo#');
        done();
      });
    })
    
  });
  
  it('PUT /:blurb_id should update blurb', function(done){
    var url = '/blurb/' + suite.blurb._id;
    var data = {
      text: '#foo#',
      path: '/bar',
      hash: 'bif'
    }
    
    request(app)
    .put(url)
    .send(data)
    .end(function(err, res){
      res.status.should.eql(200);
      res.body.blurb._id.toString().should.eql(suite.blurb._id.toString());
      res.body.blurb.text.should.eql('#foo#');
      res.body.blurb.html.should.eql('<h1>foo</h1>');
      
      Blurb.findOne({_id:suite.blurb._id}, function(err, blurb){
        blurb.text.should.eql('#foo#');
        done();
      })
    });
  });
  
  it('DELETE /:blurb_id should delete blurb', function(done){
    var url = '/blurb/' + suite.blurb._id;
    request(app)
    .delete(url)
    .end(function(err, res){
      res.status.should.eql(200);
      should(res.body.blurb).eql(null);
      
      Blurb.findOne({_id:suite.blurb._id}, function(err, blurb){
        should(err).eql(null);
        should(blurb).eql(null);
        done();
      })
    });
  });

});