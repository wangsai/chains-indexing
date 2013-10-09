/*
 * chains-indexing
 * https://github.com/saiwang/chains-indexing
 *
 * Copyright (c) 2013 WangSai
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    indexing: {
      default_options: {
        options: {
          extraData: function(filepath){return {filename: filepath};},
          includeContent: false,
          sort: function(a, b) {
            return a.basename[0] - b.basename[0];
          }
        },
        files: {
          'out/info.json': ['test/*.html'],
        },
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'indexing']);

};
