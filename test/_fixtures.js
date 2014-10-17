var ObjectID = require('mongodb').BSONNative.ObjectID;

module.exports.Blurb = {
  
  about_test_blurb: {
    _id: new ObjectID(),
    text: "#Heading 1#\n\nThis is text.",
    path: '/about',
    hash: 'test_blurb'
  },

  bio_biotext: {
    _id: new ObjectID(),
  	text: "Text on the bio page",
  	path: '/bio',
  	hash: 'biotext'
  }
}