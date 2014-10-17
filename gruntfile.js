module.exports = function(grunt) {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/blurb.js',
          'test/middleware.js',
          'test/routes.js'
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
