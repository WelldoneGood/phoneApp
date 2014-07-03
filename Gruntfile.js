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
          'src/js/app.js', 
          'src/js/Controllers/*.js', 
          'src/js/Services/*.js',
          'src/js/Directives/*.js'
        ],
        dest: 'www/js/<%= pkg.name %>.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};