module.exports = function(grunt) {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mongo-migrations')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    migrations: {
      path: __dirname + "/migrations",
      template: grunt.file.read( __dirname + "/migrations/_template.js"),
      mongo: process.env.MONGOLAB_URI || 'mongodb://localhost/mdblurb_' + process.env.NODE_ENV,
      ext: "js"
    },
    
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/unit.js',
          'test/integration.js'
        ]
      }
    },
    
    watch: {
      test: {
        files: [
          './**/*.js',
          '!./node_modules/**'
        ],
        tasks: ['mochaTest']
      }
    }

  });



  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test',['mochaTest']);
};
