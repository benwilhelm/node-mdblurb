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

blurbSchema
.virtual('rendered')
.get(function(){
    var ret = '<div id="';
    ret += this.hash;
    ret += '" ';

    if (this._id) {
        ret += 'data-blurb="' + this._id + '"';
    }

    ret += ">";
    ret += this.html;
    ret += "</div>";
    return ret;
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

mongoose.model('Blurb', blurbSchema);