module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/',
            flatten: true,
            src: [
              'jquery/jquery.js', 'jquery/jquery.min.map',
              'angular/angular.js', 'angular/angular.min.js.map'
            ],
            dest: 'public/js/lib/'
          }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('build', ['copy']);
 
  grunt.registerTask('default', ['build']);

};