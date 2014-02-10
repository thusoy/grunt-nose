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
      reports: ['reports'],
      python: ['test/**/*.pyc'],
      install_artifacts: [
        'tasks/lib/*.egg-info',
        'tasks/lib/*.tar.gz',
      ],
    },

    // Configuration to be run (and then tested).
    nose: {

      // All targets generate a report we can use to test the test execution results
      options: {
        with_xunit: true,
        xunit_file: 'reports/<%= grunt.task.current.target %>.xml',
      },

      // By default, tests will be loaded from test_venv.py and simple_test.py
      exclude: {
        options: {
          exclude: 'test_venv',
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

      virtualenv: {
        options: {
          virtualenv: 'test/test_virtualenv',
          tests: 'test_venv',
        },
        src: 'test/fixtures'
      },

      doctest: {
        options: {
          with_doctest: true,
        },
        src: "test/fixtures/package_with_doctest",
      },

      externalNose: {
        options: {
          externalNose: true,
          virtualenv: 'test/test_virtualenv_with_nose',
          tests: 'simple_test',
        },
        src: "test/fixtures",
      },

      mergeConfig: {
        options: {
          config: [
            'test/fixtures/ignore_venv.noserc',
            'test/fixtures/include_more_tests.noserc',
          ],
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

    nodeunit: {
      all: ['test/test_reports.js'],
    }

  });

  // Load grunt plugins found in package.json
  require('load-grunt-tasks')(grunt);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Task aliases
  grunt.registerTask('default', ['jshint', 'clean', 'nose', 'nodeunit']);

};
