module.exports = function(grunt) {

  grunt.initConfig({

    nose: {
      exampleProject: {
        options: {
          with_xunit: true,
          xunit_file: 'nosetests.xml',
          exclude: 'test_venv',
        }
      },

      virtualenv: {
        options: {
          virtualenv: 'venv',
        },
        src: 'tests'
      },

      externalNose: {
        options: {
          virtualenv: 'venv',
          externalNose: true,
        },
        src: "tests",
      },

    }

  });

  grunt.loadNpmTasks('grunt-nose');

};
