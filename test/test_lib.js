'use strict';

var nose = require('../tasks/nose.js');

exports.testBuildCliArg = function (test) {
  var f = nose.buildCliArg;
  test.expect(3);
  test.equals(f('exclude'), '--exclude');
  test.equals(f('with_xunit'), '--with-xunit');
  test.equals(f('very_long_parameter_thing'), '--very-long-parameter-thing');
  test.done();
};

exports.testGetPythonExec = function (test) {
  // wrap it to ensure paths always use slashes
  var f = function (virtualenv, platform) {
    var ret = nose.getPythonExecutable(virtualenv, platform);
    while (ret.indexOf('\\') !== -1) {
      ret = ret.replace('\\', '/');
    }
    return ret;
  };
  test.expect(7);
  test.equals(f({}, 'anything'), 'python');
  test.equals(f({virtualenv: '.'}, 'darwin'), 'bin/python');
  test.equals(f({virtualenv: '.'}, 'win32'), 'Scripts/python.exe');
  test.equals(f({virtualenv: '..'}, 'linux'), '../bin/python');
  test.equals(f({virtualenv: '..'}, 'win32'), '../Scripts/python.exe');
  test.equals(f({virtualenv: 'virtualenv'}, 'freebsd'), 'virtualenv/bin/python');
  test.equals(f({virtualenv: 'virtualenv'}, 'win32'), 'virtualenv/Scripts/python.exe');
  test.done();
};

exports.testGetPythonCode = function (test) {
  var f = nose.getPythonCode;
  test.expect(3);
  var internalNoseRegex =
    /import sys; sys\.path\.insert\(0, r".*tasks[\/\\]lib"\); from nose\.core import run_exit; run_exit()/;
  test.ok(internalNoseRegex.test(f({externalNose: false})));
  var externalNoseRegex = /from nose\.core import run_exit; run_exit()/;
  test.ok(externalNoseRegex.test(f({externalNose: true})));
  test.ok(externalNoseRegex.test(f({})));
  test.done();
};

exports.testGetNoseArgsConfig = function (test) {
  var f = nose.getNoseArgs;
  test.expect(2);
  // Test with a string
  test.ok(/--config=.*myConfig/.test(f([], {config: 'myConfig'}, {})[0]));
  // test with an array
  var doubleConfigRegex = /--config=.*myConfig --config=.*otherConfig/;
  test.ok(doubleConfigRegex.test(f([], {config: ['myConfig', 'otherConfig']}, {}).join(' ')));
  test.done();
};

exports.testGetNoseArgsFlags = function (test) {
  var f = nose.getNoseArgs;
  test.expect(2);
  test.equals('--hey', f([], {hey: true}, {}).join(' '));
  test.equals('--key=value', f([], {key: 'value'}, {}).join(' '));
  test.done();
};
