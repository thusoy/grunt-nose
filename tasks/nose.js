/*
 * grunt-nose
 * https://github.com/tarjei/grunt-nose
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the Apache, 2.0 licenses.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');

  var getVirtualenvActivationCode = function(virtualenv){
      var activateThisPath;
      var activeThisPathAlternatives = [
        // *nix activate_this path:
        path.join(virtualenv, 'bin', 'activate_this.py'),
        // windows style path:
        path.join(virtualenv, 'Scripts', 'activate_this.py'),
      ];
      grunt.util._.forEach(activeThisPathAlternatives, function(path){
        if (grunt.file.exists(path)){
          activateThisPath = path;
          return false; // stops iteration
        }
      });
      if (activateThisPath === undefined){
        grunt.fail.warn('Tried to activate virtualenv "' + virtualenv + '", but did not ' +
          'find the file "activate_this.py" required for activation, after trying ' +
          'these locations:\n' + activeThisPathAlternatives.join("\n") +
          '\nMake sure this file exist at either of these locations, and try again.');
      }
      var activationCode = 'f = r"'+activateThisPath+'"; import activation_tools as at; at.activate_virtualenv(f)';

      return activationCode;
  };

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

    // Extract options not to be passed along to nose
    var virtualenv = 'pass';
    if (options.virtualenv){
      virtualenv = getVirtualenvActivationCode(options.virtualenv);
      grunt.log.verbose.writeln("Using virtualenv at " + options.virtualenv);
      delete options.virtualenv;
    }
    
    var pythonCode = [];  
      
    var externalNose = options.externalNose;
    delete options.externalNose;

    pythonCode.push('import sys');
      
    if (!externalNose) {
      pythonCode.push('sys.path.insert(0, r"'+path.join(__dirname, 'lib')+'")');

    }

    pythonCode.push(virtualenv, 'from nose.core import run_exit', 'run_exit()');
      
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
        if (prop === 'config' && typeof options[prop] === 'Object'){
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

    grunt.log.verbose.writeln("Running nose with the following args: " + args.join(", "));

    var nose = grunt.util.spawn({
      'cmd': 'python',
      'args': baseArgs.concat(args),
      'opts': {
        'cwd': process.cwd(),
        'stdio': 'inherit',
      }
    }, function(error, result, code){
      if (code === 0){
        grunt.log.ok("Python unit tests completed successfully.");
      }
      done(code === 0);
    });

  });

};
