require('./Blurb.js');
var config = require('./config')
  , express = require('express')
  , mongoose = require('mongoose')
  ,   Blurb = mongoose.model('Blurb')
  , router = express.Router()
  , theModule = require('./index')
  ;
  
var respondNormal = function(res, payload, varName) {
  var key = varName || 'payload';
  var resp = {};
  resp[key] = payload;
  resp.status = 'success';
  resp.message = null;
  res.json(resp);
}

var respondError = function(res, message, varName, st) {
  var key = varName || 'payload';
  var status = st || 500;
  var resp = {};
  resp[key] = null;
  resp.status = 'error';
  resp.message = message;
  res.status(status);
  res.json(resp);
}

router.param('blurb_id', function(req, res, next, id){
  Blurb.findOne({_id: id}, function(err, blurb){
    
    if (err
    && err.name === 'CastError'
    && err.type === 'ObjectId') {
      res.status(404).end();
      return;
    }
    
    if (err) {
      next(err);
      return;
    }
    
    if (!blurb) {
      next(new Error("Could not load blurb."));
      return; 
    }
    
    req.blurb = blurb;
    next();
  });
})

router.get("/:blurb_id",function(req, res){
  respondNormal(res, req.blurb, 'blurb');
});

router.post('/', function(req, res){
  var blurb = new Blurb(req.body);
  blurb.save(function(err, blurb){
    if (err) {
      console.error(err);
      respondError(res, "Could not create blurb", 'blurb');
      return;
    }
    
    respondNormal(res, blurb, 'blurb')
  });
});

router.put('/:blurb_id', function(req, res){
  req.blurb.set(req.body);
  req.blurb.save(function(err, blurb){
    if (err) {
      console.error(err);
      respondError(res, "Could not update blurb", 'blurb');
      return;
    }
    
    respondNormal(res, blurb, 'blurb');
  });
});


router.delete('/:blurb_id', function(req, res){
  req.blurb.remove(function(err, rslt){
    if (err) {
      console.error(err);
      respondError(res, "Error deleting blurb", 'blurb');
      return;
    }
    respondNormal(res, null, 'blurb');
  });
});

module.exports = router;