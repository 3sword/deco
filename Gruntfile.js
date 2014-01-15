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
              'angular/angular.js', 'angular/angular.min.js.map',
              'angular-route/angular-route.js', 'angular-route/angular-route.min.js.map',
              'angular-cookies/angular-cookies.js', 'angular-cookies/angular-cookies.min.js.map',
              'angular-sanitize/angular-sanitize.js', 'angular-sanitize/angular-sanitize.min.js.map',
              'underscore/underscore.js', 'underscore/underscore.min.js.map',
              'underscore.string/dist/underscore.string.min.js',
              'restangular/dist/restangular.js', 'markdown/lib/markdown.js',
              'bootstrap/dist/js/*'
            ],
            dest: 'public/js/lib/'
          },
          {
            expand: true,
            cwd: 'bower_components/',
            flatten: true,
            src: [
              'bootstrap/dist/css/bootstrap.css', 'bootstrap/dist/css/bootstrap-theme.css'
            ],
            dest: 'public/css/'
          },
          {
            expand: true,
            cwd: 'bower_components/',
            flatten: true,
            src: [
              'bootstrap/dist/fonts/*'
            ],
            dest: 'public/fonts/'
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
