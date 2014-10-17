process.env.NODE_ENV = 'test';
require('../Blurb');

var async = require('async')
  , fixtures = require('pow-mongoose-fixtures')
  , mongoose = require('mongoose')
  ,   Blurb = mongoose.model('Blurb')
  , should = require('should')
  ;

mongoose.connect('mongodb://localhost/mdblurb_test');

describe("Blurb Model", function(){
    
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
            text: "**this** is markdown\n\nparagraph two",
        });
        blurb.html.should.eql("<p><strong>this</strong> is markdown</p>\n\n<p>paragraph two</p>");
        done();
    });
    
    /**
     * using the virtuals:true option for toJSON in the model causes
     * the virtual properties to be persisted to the database. this
     * test is to ensure that the virtuals continue to respond to changes
     * in the properties they depend on
     */
    it("should return updated html with markdown change", function(done){
        suite.blurb.text = "###new text###";
        suite.blurb.html.should.eql('<h3>new text</h3>');
        suite.blurb.save(function(err, blurb){
            should(err).eql(null);
            blurb.html.should.eql('<h3>new text</h3>');
            done();
        });
    })
    
    it("should return <path>#<hash> with virtual property `pathWithHash`", function(done){
        var blurb = new Blurb({
            path: '/about',
            hash: 'foo'
        });
        blurb.pathWithHash.should.eql('/about#foo');
        done();
    })

    it('`render(true)` should return html with editing data', function(done){
        var blurb = new Blurb({
            text: 'foo',
            path: '/bar',
            hash: 'bif'
        });

        blurb.save(function(err, blurb){
            var data_id = blurb._id.toString();
            blurb.render(true).should.match(/\<span data-blurb/);
            done();
        })
    })


    it('`render(false)` should return html without editing data', function(done){
        var blurb = new Blurb({
            text: 'foo',
            path: '/bar',
            hash: 'bif'
        });

        blurb.save(function(err, blurb){
            var data_id = blurb._id.toString();
            blurb.render(false).should.eql("<p>foo</p>");
            done();
        })
    })
})