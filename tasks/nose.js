/*
 * grunt-nose
 * https://github.com/tarjei/grunt-nose
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the Apache, 2.0 licenses.
 */

'use strict';

var path = require('path');

/* Get a python exe to use. If virtualenv is not defined, will use the one found on PATH. */
function getPythonExecutable(virtualenv) {
  var isWin = /^win/.test(process.platform);
  var pythonExec = isWin ?
    path.join(virtualenv, 'Scripts', 'python.exe') :
    path.join(virtualenv, 'bin', 'python');
  return pythonExec;
}

module.exports = function(grunt) {


  grunt.registerMultiTask('nose', 'Run python unit tests with nose.', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Fail if the 'where' option is given
    if (options['where'] !== undefined){
      grunt.fail.warn("Dont't specify the 'where' option in the options, use the task src property instead!");
    }


    // Arguments to be passed along to nose
    var args = [];
    var pythonCode = [];

    // Extract options not to be passed along to nose
    var pythonExecutable = 'python';
    if (options.virtualenv) {
      pythonExecutable = getPythonExecutable(options.virtualenv);
      delete options.virtualenv;
    }

    var externalNose = options.externalNose;
    delete options.externalNose;

    if (!externalNose) {
      // Use the nose shipped with the plugin
      pythonCode.push('import sys', 'sys.path.insert(0, r"' + path.join(__dirname, 'lib') + '")');
    }

    pythonCode.push('from nose.core import run_exit', 'run_exit()');

    var baseArgs = [
      '-c',
      pythonCode.join('; ')
    ];

    // Set the nose 'where' option for each of the files specified for the task
    this.filesSrc.forEach(function(filepath){
      args.push('--where=' + path.join(process.cwd(), filepath));
    });

    for (var prop in options){
      // If it's a flag that's set to false, skip
      if (!options.hasOwnProperty(prop) || options[prop] === false){
        continue;
      }

      var cli_arg = '--' + prop;
      while (cli_arg.indexOf("_") !== -1){
        cli_arg = cli_arg.replace('_', '-');
      }

      // If the property is not a flag, add the desired option value
      if (options[prop] !== true){

        // If the option value is a file path, make sure it's relative the the process cwd, since
        // the node process is spawned with a different cwd.
        var fileOptions = [
          'config',
          'debug_log',
          'logging_config',
          'log_config',
          'cover_html_dir',
          'cover_xml_file',
          'profile_stats_file',
          'id_file',
          'xunit_file'
        ];

        // Several config files can be merged
        if (prop === 'config' && typeof options[prop] === 'object'){
          for(var i = 0; i < options[prop].length; i++){
            var configFile = options[prop][i];
            args.push('--config=' + configFile);
          }
          continue;
        }

        // Options that create a file
        // For convenience, we will make sure to create the directory where these files
        // will be stored, since nose won't do this for us
        var createsFileOpts = [
          'debug_log',
          'cover_html_dir', // Certain that this is needed?
          'cover_xml_file',
          'profile_stats_file',
          'id_file',
          'xunit_file'
        ];

        if (fileOptions.indexOf(prop) === -1){
          cli_arg += "=" + options[prop];
        } else {
          cli_arg += "=" + path.join(process.cwd(), options[prop]);

          // Add some convenience lacking in nose, make sure to create the output directory if not present
          // Only do this for the options creating a output file
          if (createsFileOpts.indexOf(prop) !== -1){
            var targetDir = path.join(process.cwd(), path.dirname(options[prop]));
            if (!grunt.file.isDir(targetDir)){
              grunt.log.verbose.writeln("Created folder " + targetDir);
              grunt.file.mkdir(targetDir);
            }
          }
        }
      }
      args.push(cli_arg);
    }

    grunt.log.verbose.writeln("Using python executable at " + pythonExecutable);
    grunt.log.verbose.writeln("Running nose with the following args: " + args.join(" "));

    var nose = grunt.util.spawn({
      'cmd': pythonExecutable,
      'args': baseArgs.concat(args),
      'opts': {
        'cwd': process.cwd(),
        'stdio': 'inherit',
      }
    }, function(error, result, code){
      if (code === 0){
        grunt.log.ok("Python unit tests completed successfully.");
      } else {
        grunt.log.writeln("Something failed spawning python. I tried to launch this python: " +
          pythonExecutable + ", please check that this works. Also, I tried to pass the " +
          "following arguments: " + '-c "' + baseArgs.slice(1).join(" ") + '"' + args.join(" "));
      }
      done(code === 0);
    });

    nose.on('error', function (err) {
      grunt.log.error("Running nose failed with the following error: " + err);
    });

  });

};
