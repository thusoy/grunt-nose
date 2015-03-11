/*
 * grunt-nose
 * https://github.com/tarjei/grunt-nose
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the Apache, 2.0 licenses.
 */

 // jshint camelcase:false

'use strict';

module.exports = function (grunt) {

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
      reports: ['reports'],
      python: ['test/**/*.pyc'],
      installArtifacts: [
        'tasks/lib/*.egg-info',
      ],
    },

    // Configuration to be run (and then tested).
    nose: {

      // All targets generate a report we can use to test the test execution results
      options: {
        with_xunit: true,
        xunit_file: 'reports/<%= grunt.task.current.target %>.xml',
      },

      // By default, tests will be run from simple_test.py and test_exclude.py
      exclude: {
        options: {
          exclude: 'test_exclude',
        },
        src: 'test/fixtures',
      },

      // Try to include more_tests.py as well
      specificTests: {
        options: {
          tests: [
            'more_tests',
            'simple_test',
          ],
          include: "passing",
        },
        src: 'test/fixtures',
      },

      doctest: {
        options: {
          with_doctest: true,
        },
        src: "test/fixtures/package_with_doctest",
      },

      mergeConfig: {
        options: {
          config: [
            'test/fixtures/exclude.noserc',
            'test/fixtures/include_more_tests.noserc',
          ],
        },
        src: "test/fixtures",
      },

      multiDirectoryLoading: {
        src: [
          "test/fixtures",
          "test/other_testdir",
        ]
      }
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'Release v<%= version %>',
      }
    },

    nodeunit: {
      all: ['test/test_*.js'],
    }

  });

  // Load grunt plugins found in package.json
  require('load-grunt-tasks')(grunt);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Task aliases
  grunt.registerTask('default', ['jshint', 'clean', 'nose', 'nodeunit']);

};
