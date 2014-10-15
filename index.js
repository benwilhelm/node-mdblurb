var app = {}
  , config = require('./config.js')
  , markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  , router = require('./router')
  ;
  
module.exports = { 
    
    registerApp: function(theApp) {
        app = theApp;
        app.use(config.contentPath, router);
    },
    
    set: function(key,val) {
        config[key] = val;
    },
    
    get: function(key) {
        return config[key];
    },
    
    toHTML: function(md) {
        return markdown.toHTML(md);
    }
}