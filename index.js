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

        if (opts.auth)        config.auth = opts.auth
        if (opts.preSave)     config.preSave = opts.preSave
        if (opts.contentPath) config.contentPath = opts.contentPath
        if (opts.connectionString) mongoose.connect(opts.connectionString);
        
        var authRespond = function(req, res, next) {
            if (req.hasOwnProperty('canEditBlurb') && !req.canEditBlurb) {
                res.status(401).end();
                return;
            }
            next();
        }

        // route middleware and router
        app.post(config.contentPath, config.auth, authRespond);
        app.put(config.contentPath + '/:blurb_id', config.auth, authRespond)
        app.delete(config.contentPath + '/:blurb_id', config.auth, authRespond)

        // load blurbs to routes
        app.use(config.auth);
        app.use(function(req, res, next){
          Blurb.find({path: req.url}, function(err, blurbs){
            if (err) {
              console.error(err);
              next(err);
            }

            res.locals.blurbs = res.locals.blurbs || {};
            blurbs.forEach(function(blurb){
              blurb.rendered = blurb.render(req.canEditBlurb);
              res.locals.blurbs[blurb.hash] = blurb;
            })
            next();
          })
        });


        app.use(config.contentPath, router);
    },
    
    toHTML: function(md) {
        return markdown.toHTML(md);
    },

    Blurb: mongoose.model('Blurb')
}