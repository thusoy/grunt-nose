/*
 * grunt-nose
 * https://github.com/tarjei/grunt-nose
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the Apache, 2.0 licenses.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      report: ['nosetests.xml'],
      python: ['test/**/*.pyc'],
      install_artifacts: [
        'tasks/lib/*.egg-info',
        'tasks/lib/*.tar.gz',
      ],
    },

    // Configuration to be run (and then tested).
    nose: {

      custom_options: {
        options: {
          exclude: 'test_venv',
          with_xunit: true,
          verbose: false,
          xunit_file: 'nosetests.xml',
        },
        src: 'test/fixtures',
      },

      test_options: {
        options: {
          tests: [
            'more_tests',
            'simple_test',
          ],
          debug: [
            'nose.plugins',
            'nose.importer',
          ],
          include: "passing",
        },
        src: 'test/fixtures',
      },

      test_venv: {
        options: {
          virtualenv: 'test/fixtures/test_virtualenv',
          tests: 'test_venv',
        },
        src: 'test/fixtures'
      },

      doctest_and_xunit: {
        options: {
          exclude: "test_venv",
          with_doctest: true,
          with_xunit: true,
        },
        src: "test/fixtures",
      },
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'Release v<%= version %>',
      }
    },

  });

  // Load grunt plugins found in package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Task aliases
  grunt.registerTask('default', ['jshint', 'clean', 'nose']);

};
