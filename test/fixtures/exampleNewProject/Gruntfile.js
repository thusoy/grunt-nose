module.exports = function(grunt) {

  grunt.initConfig({

    nose: {
      exampleProject: {
        options: {
          with_xunit: true,
          xunit_file: 'nosetests.xml',
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-nose');

};
