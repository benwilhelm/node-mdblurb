process.env.NODE_ENV = 'test';
require('../Blurb');

var mongoose = require('mongoose')
  , Blurb = mongoose.model('Blurb')
  , should = require('should')
  ;

mongoose.connect('mongodb://localhost/mdblurb_test');

describe("Blurb Model", function(){
    
    before(function(done){
        mongoose.connection.collections.blurbs.remove({}, done);
    })
    
    it("should require path", function(done){
        var blurb = new Blurb({
            hash: 'foo'
        });
        blurb.save(function(err, blurb){
            should(blurb).not.be.ok;
            err.errors.path.type.should.eql('required');
            done();
        });
    })
    
    it("should require hash", function(done){
        var blurb = new Blurb({
            path: '/foo'
        });
        blurb.save(function(err, blurb){
            should(blurb).not.be.ok;
            err.errors.hash.type.should.eql('required');
            done();
        });
    })
    
    it("should create with empty text attribute if none provided", function(done){
        var blurb = new Blurb({
            path: '/',
            hash: 'foo'
        });
        blurb.save(function(err, blurb){
            should(err).be.null;
            blurb.text.should.eql('');
            done();
        });
    });
    


    it("should convert markdown to html with `html` virtual", function(done){
        var blurb = new Blurb({
            text: "**this** is markdown",
        });
        blurb.html.should.eql("<p><strong>this</strong> is markdown</p>");
        done();
    });
    
    it("should return <path>#<hash> with virtual property `pathWithHash`", function(done){
        var blurb = new Blurb({
            path: '/about',
            hash: 'foo'
        });
        blurb.save(function(err, blurb){
            should(err).be.null;
            blurb.pathWithHash.should.eql('/about#foo');
            done();
        });
    })
})