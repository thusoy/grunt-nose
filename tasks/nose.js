/*
 * grunt-nose
 * https://github.com/tarjei/grunt-nose
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');

// Get the path to the python executable. If a virtualenv is specified, use that one
function getPythonExecutable(options, platform) {
  if (options.virtualenv) {
    var isWin = /^win/.test(platform);
    var pythonExec = isWin ?
      path.join(options.virtualenv, 'Scripts', 'python.exe') :
      path.join(options.virtualenv, 'bin', 'python');
    delete options.virtualenv;
    return pythonExec;
  } else {
    return 'python';
  }
}

// Convert a property like 'with_xunit' to cli-arg style '--with-xunit'
function buildCliArg(prop) {
  var cliArg = '--' + prop;
  while (cliArg.indexOf("_") !== -1) {
    cliArg = cliArg.replace('_', '-');
  }
  return cliArg;
}

function getPythonCode(options) {
  var internalNose = !options.externalNose;
  var pythonCode = [];
  if (internalNose) {
    // Use the nose shipped with the plugin
    pythonCode.push('import sys', 'sys.path.insert(0, r"' + path.join(__dirname, 'lib') + '")');
  }
  pythonCode.push('from nose.core import run_exit', 'run_exit()');
  delete options.externalNose;
  return pythonCode.join('; ');
}

function getNoseArgs(files, options, grunt) {
  var noseArgs = [];

  // Set the nose 'where' option for each of the files
  files.forEach(function (filepath) {
    noseArgs.push('--where=' + path.join(process.cwd(), filepath));
  });

  var addConfigFile = function (configFile) {
    noseArgs.push('--config=' + configFile);
  };

  for (var prop in options) { // jshint forin: false
    // If it's a flag that's set to false, skip
    if (!options.hasOwnProperty(prop) || options[prop] === false) {
      continue;
    }

    var cliArg = buildCliArg(prop);

    // If the property is not a flag, add the desired option value
    if (options[prop] !== true) {

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
      // pass all of them if an array is given
      if (prop === 'config' && typeof options[prop] === 'object') {
        options[prop].forEach(addConfigFile);
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

      if (fileOptions.indexOf(prop) === -1) {
        cliArg += "=" + options[prop];
      } else {
        cliArg += "=" + path.join(process.cwd(), options[prop]);

        // Add some convenience lacking in nose, make sure to create the output directory if not
        // present. Only do this for the options creating an output file.
        if (createsFileOpts.indexOf(prop) !== -1) {
          var targetDir = path.join(process.cwd(), path.dirname(options[prop]));
          if (!grunt.file.isDir(targetDir)) {
            grunt.log.verbose.writeln("Created folder " + targetDir);
            grunt.file.mkdir(targetDir);
          }
        }
      }
    }
    noseArgs.push(cliArg);
  }
  return noseArgs;
}

module.exports = function (grunt) {

  grunt.registerMultiTask('nose', 'Run python unit tests with nose.', function () {
    /*
    * What is done in this task is to build a set of arguments to pass along to python.
    *
    * We first try to find which python executable to run (path or virtualenv), then we
    * build some python code that will run nose (passed as argument to 'python -c'),
    * then we pass the nose related arguments. So the final spawn is on the form:
    *
    *   $ python -c "<python code to import and execute nose>" <nose-param-1> <nose-param-2> etc..
    */
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Fail if the 'where' option is given
    if (options.where !== undefined) {
      grunt.fail.warn("Dont't specify the 'where' option in the options, use the task src " +
        "property instead!");
    }

    var pythonExecutable = getPythonExecutable(options, process.platform);
    var pythonCode = getPythonCode(options);
    var noseArgs = getNoseArgs(this.filesSrc, options, grunt);

    grunt.log.verbose.writeln("Using python executable at " + pythonExecutable);
    grunt.log.verbose.writeln("Running nose with the following args: " + noseArgs.join(" "));

    var nose = grunt.util.spawn({
      'cmd': pythonExecutable,
      'args': ['-c', pythonCode].concat(noseArgs),
      'opts': {
        'cwd': process.cwd(),
        'stdio': 'inherit',
      }
    }, function (error, result, code) {
      if (code === 0) {
        grunt.log.ok("Python unit tests completed successfully.");
      }
      done(code === 0);
    });

    nose.on('error', function (err) {
      grunt.log.error("Running nose failed with the following error: " + err);
      grunt.log.error("I tried to launch this python: " + pythonExecutable + ", " +
        'with the following arguments: -c "' + pythonCode + '"' + noseArgs.join(" ") +
        ", ");
    });

  });

};

// Export the functions so that they can be tested
module.exports.buildCliArg = buildCliArg;
module.exports.getPythonExecutable = getPythonExecutable;
module.exports.getPythonCode = getPythonCode;
module.exports.getNoseArgs = getNoseArgs;
