require('./Blurb')
var app = {}
  , config = require('./config')
  , markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  ,   Blurb = mongoose.model('Blurb')
  , router = require('./router')
  ;

module.exports = { 

    registerApp: function(theApp, opts) {
        app = theApp;
        app.set('blurbConfig', config);
        opts = opts || {};

        // load blurbs to routes
        app.use(function(req, res, next){
          Blurb.find({path: req.url}, function(err, blurbs){
            if (err) {
              console.error(err);
              next(err);
            }

            res.locals.blurbs = res.locals.blurbs || {};
            blurbs.forEach(function(blurb){
              res.locals.blurbs[blurb.hash] = blurb;
            })
            next();
          })
        });

        if (opts.auth)        config.auth = opts.auth
        if (opts.preSave)     config.preSave = opts.preSave
        if (opts.contentPath) config.contentPath = opts.contentPath

        // route middleware and router
        app.post(config.contentPath, config.auth)
        app.put(config.contentPath + '/:blurb_id', config.auth)
        app.delete(config.contentPath + '/:blurb_id', config.auth)
        app.use(config.contentPath, router);
    },
    
    toHTML: function(md) {
        return markdown.toHTML(md);
    }
}