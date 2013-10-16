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
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      report: ['nosetests.xml'],
      python: ['test/**/*.pyc'],
      install_artifacts: ['tasks/lib/*.egg-info'],
    },

    // Configuration to be run (and then tested).
    nose: {

      default: {
      },

      custom_options: {
        options: {
          with_xunit: true,
          xunit_file: 'nosetests.xml',
        },
        src: 'test/fixtures',
      },

      test_options: {
        options: {
          verbose: true,
          tests: [
            'more_tests',
            'tests',
          ],
          // match: "passing",
          debug: [
            'nose.plugins',
            'nose.importer',
          ],
          include: "passing",
          //pdb_failures: true,
          //eval_attr: "do_run",
        },
        //src: 'test/fixtures',
      },

      full_example: {
        options: {
          exclude: "test_fails",
          verbose: true,
          with_coverage: true,
          cover_package: "fixtures",
          cover_branches: true,
          cover_xml: true,
          cover_html: true,
          cover_html_dir: 'code_coverage',
          virtualenv: 'test/fixtures/test_virtualenv',
          with_doctest: true,
          with_xunit: true,
        },
        src: "test/fixtures",
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
