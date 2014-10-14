var markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  ;
  
var blurbSchema = new mongoose.Schema({
    text: {
        type: String
    },
    
    path: {
        type: String,
        required: true
    },
    
    hash: {
        type: String,
        required:true
    }
});


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

blurbSchema.pre('save', function(next){
    if (!this.text) {
        this.text = '';
    }
    next();
});

mongoose.model('Blurb', blurbSchema);