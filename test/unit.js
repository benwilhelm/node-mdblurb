process.env.NODE_ENV = 'test';
require('../Blurb');

var mongoose = require('mongoose')
  , Blurb = mongoose.model('Blurb')
  , should = require('should')
  ;

mongoose.connect('mongodb://localhost/mdblurb_test');

describe("Blurb Model", function(){
    
    before(function(done){
        mongoose.connection.collections.blurbs.drop(done);
    })
    
    it("should convert markdown to html with `html` virtual", function(done){
        var blurb = new Blurb({text: "**this** is markdown"});
        blurb.html.should.eql("<p><strong>this</strong> is markdown</p>");
        done();
    });
    
    it("should create with empty text attribute if none provided", function(done){
        var blurb = new Blurb();
        blurb.save(function(err, blurb){
            should(err).be.null;
            blurb.text.should.eql('');
            done();
        });
    });
})