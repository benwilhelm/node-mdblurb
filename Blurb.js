var markdown = require('markdown').markdown
  , mongoose = require('mongoose')
  ;
  
var blurbSchema = new mongoose.Schema({
    text: {
        type: String
    }
});


blurbSchema
.virtual('html')
.get(function(){
    return markdown.toHTML(this.text);
})


blurbSchema.pre('save', function(next){
    if (!this.text) {
        this.text = '';
    }
    next();
});

mongoose.model('Blurb', blurbSchema);