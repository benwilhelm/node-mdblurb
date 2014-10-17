module.exports = {
    auth: function(req, res, next) {
      req.canEditBlurb = true;
      next();
    },
    
    preSave: function(next) { next(); },
    contentPath: '/blurb'  
}