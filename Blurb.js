var markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  ;
  
/******************
 * Model Properties
 *******************/

var blurbSchema = new mongoose.Schema({
    text: {
        type: String
    },
    
    path: {
        type: String,
        required: true,
        index: true
    },
    
    hash: {
        type: String,
        required:true
    }

}, {
    toObject: { virtuals: true },
    toJSON:   { virtuals: true }
});


/******************
 * Virtual Properties
 *******************/

blurbSchema
.virtual('html')
.get(function(){
    return markdown.toHTML(this.text);
})

blurbSchema
.virtual('pathWithHash')
.get(function(){
    return this.path + '#' + this.hash;
})


/******************
 * Pre Middleware
 *******************/
blurbSchema.pre('save', function(next){
    if (!this.text) {
        this.text = '';
    }
    next();
});


/******************
 * Object Methods
 *******************/
blurbSchema.methods.render = function(canEdit){
    var blurb = this;
    var ret = blurb.html;
    
    if (canEdit) {
        var data_blurb = blurb._id ? blurb._id.toString() : 'new';
        ret += '<span data-blurb-id="' + blurb._id + '"></span>';
    }
    
    return ret;
}




mongoose.model('Blurb', blurbSchema);