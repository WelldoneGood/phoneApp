module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        options: {
          separator: '\n'
        },
        src: ['src/css/*.css'],
        dest: 'www/css/<%= pkg.name %>.css'
      },
      javascript: {
        options: {
          separator: ';\n'
        },
        src: [
          'src/js/mainApp/app.js', 
          'src/js/mainApp/Controllers/*.js', 
          'src/js/mainApp/Services/*.js',
          'src/js/mainApp/Directives/*.js'
        ],
        dest: 'www/js/<%= pkg.name %>.js'
      },
      javascriptLogin: {
        options: {
          separator: ';\n'
        },
        src: [
        'src/js/login/app.js',
        'src/js/login/Controllers/*.js',
        'src/js/login/Services/*.js'
        ],
        dest: 'www/js/<%= pkg.name %>Login.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};