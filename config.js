module.exports = {
    auth: function(req, res, next) { next(); },
    preSave: function(next) { next(); },
    contentPath: '/blurb'  
}