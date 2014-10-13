var app
  , express = require('express')
  , markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  ;
  
module.exports = {   
    
    registerApp: function(incomingApp) {
        app = incomingApp;
    },
    
    toHTML: function(md) {
        return markdown.toHTML(md);
    }
}