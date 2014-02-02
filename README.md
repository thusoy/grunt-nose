# grunt-nose

[![Build Status](https://travis-ci.org/thusoy/grunt-nose.png?branch=master)](https://travis-ci.org/thusoy/grunt-nose)

> Running python unit tests using nose.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nose --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nose');
```

## The "nose" task

### Overview
In your project's Gruntfile, add a section named `nose` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  nose: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

The `nose` task accepts all the same options as the nose CLI does. If you want to run nose with any additional plugins (like coverage or similar), you must install them separately, either into your system environment or into a virtualenv, and run the grunt task in the virtualenv.

#### verbose
Type: `Boolean`  
Default: false

Be more verbose.

#### quiet
Type: `Boolean`  
Default: false

Be less verbose.

#### config
Type: `String` or `Array`

Load configuration from config file(s). May be specified multiple times; in that case, all config files will be loaded and combined

#### py3where
Type: `String`

Look for tests in this directory under Python 3.x. Functions the same as 'where', but only applies if running under Python 3.x or above.  Note that, if present under 3.x, this option completely replaces any directories specified with 'where', so the 'where' option becomes ineffective.

#### match
Type: `String`  
Default: "(?:^|[\b_\./-])[Tt]est"

Files, directories, function names, and class names that match this regular expression are considered tests.

#### tests
Type: `Array`  
Default: Runs all tests found

Run these tests (the array should be names of modules), and no others.

#### debug
Type: `Array` or `String`

Activate debug logging for one or more systems. Available debug loggers: nose, nose.importer, nose.inspector, nose.plugins, nose.result and nose.selector.

#### debug_log
Type: `String`  
Default: sys.stderr

Log debug messages to this file.

#### log_config
Type: `String`

Load logging config from this file -- bypasses all other logging config settings.

#### ignore_files
Type: `String` or `Array`

Completely ignore any file that matches this regular expression. Takes precedence over any other settings or plugins. Specifying this option will replace the default setting. Specify this option as an array to add more regular expressions.

#### exclude=REGEX
Type: `String`

Don't run tests that match regular expression

#### include=REGEX
Type: `String` or `Array`

This regular expression will be applied to files, directories, function names, and class names for a chance to include additional tests that do not match `options.match`.  Specify this option as an array to add more regular expressions.

#### stop
Type: `Boolean`  
Default: false

Stop running tests after the first error or failure

#### no_path_adjustment
Type: `Boolean`  
Default: false

Don't make any changes to sys.path when loading tests

#### exe
Type: `Boolean`  
Default: false

Look for tests in python modules that are executable. Normal behavior is to exclude executable modules, since they may not be import-safe.

#### noexe
Type: `Boolean`

DO NOT look for tests in python modules that are executable. (The default on the windows platform is to do so.)

#### traverse_namespace
Type: `Boolean`  
Default: false

Traverse through all path entries of a namespace package.

#### first_package_wins
Type: `Boolean`  
Default: false

nose's importer will normally evict a package from sys.modules if it sees a package with the same name in a different location. Set this option to disable that behavior.

#### no_byte_compile
Type: `Boolean`
default: false

Prevent nose from byte-compiling the source into .pyc files while nose is scanning for and running tests.

#### attr
Type: `String`

Run only tests that have attributes specified by `attr`.

#### eval_attr
Type: `String`

Run only tests for whose attributes the Python expression EXPR evaluates to True.

#### nocapture
Type: `Boolean`  
Default: false

Don't capture stdout (any stdout output will be printed immediately).

#### nologcapture
Type: `Boolean`  
Default: false

Disable logging capture plugin. Logging configurtion will be left intact.

#### logging_format
Type: `String`

Specify custom format to print statements. Uses the same format as used by standard logging handlers.

#### logging_datefmt
Type: `String`

Specify custom date/time format to print statements. Uses the same format as used by standard logging handlers.

### logging_filter
Type: `String`

Specify which statements to filter in/out. By default, everything is captured. If the output is too verbose, use this option to filter out needless output. Example: filter=foo will capture statements issued ONLY to  foo or foo.what.ever.sub but not foobar or other logger. Specify multiple loggers with comma: filter=foo,bar,baz. If any logger name is prefixed with a minus, eg filter=-foo, it will be excluded rather than included. Default: exclude logging messages from nose itself (-nose). Can also be specified by envvar NOSE_LOGFILTER.

#### logging_clear_handlers
Type: `Boolean`  
Default: false

Clear all other logging handlers

### logging_level
Type: `String`  
Default: 'DEBUG'

Set the log level to capture

#### with_coverage
Type: `Boolean`  
Default: false

Enable plugin Coverage:  Activate a coverage report using Ned Batchelder's coverage module. Requires coverage to be installed separetly, f. ex in a virtualenv specified by `options.virtualenv`.

#### cover_package
Type: `String`  
Default: All packages

Restrict coverage output to selected packages

#### cover_erase
Type: `Boolean`  
Default: false

Erase previously collected coverage statistics before run.

#### cover_tests
Type: `Boolean`  
Default: false

Include test modules in coverage report.

#### cover_min_percentage
Type: `Number`  
Default: 0

Minimum percentage of coverage for tests to pass.

#### cover_inclusive
Type: `Boolean`  
Default: false

Include all python files under working directory in coverage report.  Useful for discovering holes in test coverage if not all files are imported by the test suite.

#### cover_html
Type: `Boolean`  
Default: false

Produce HTML coverage information.

#### cover_html_dir
Type: `String`

Produce HTML coverage information in dir.

#### cover_branches
Type: `Boolean`  
Default: false

Include branch coverage in coverage report.

#### cover_xml
Type: `Boolean`  
Default: false

Produce XML coverage information.

#### cover_xml_file
Type: `String`

Produce XML coverage information in file.

#### pdb
Type: `Boolean`  
Default: false

Drop into debugger on errors. Pass in a EOF to end the session (Ctrl+D on Mac).

#### pdb_failures
Type: `Boolean`  
Default: false

Drop into debugger on failures.

#### no_deprecated
Type: `Boolean`  
Default: false

Disable special handling of DeprecatedTest exceptions.

#### with_doctest
Type: `Boolean`  
Default: false

Enable plugin Doctest:  Activate doctest plugin tofind and run doctests in non-test modules.

#### doctest_tests
Type: `Boolean`  
Default: false

Also look for doctests in test modules. Note that classes, methods and functions should have either doctests or non-doctest tests, not both.

#### doctest_extension
Type: `String`  
Default: false

Also look for doctests in files with this extension.

#### doctest_result_variable
Type: `String`

Change the variable name set to the result of the last interpreter command from the default '_'. Can be used to avoid conflicts with the _() function used for text translation.

#### doctest_fixtures
Type: `String`

Find fixtures for a doctest file in module with this name appended to the base name of the doctest file.

#### doctest_options
Type: `String`

Specify options to pass to doctest. Eg. '+ELLIPSIS,+NORMALIZE_WHITESPACE'.

#### with_isolation
Type: `Boolean`  
Default: false

Enable plugin IsolationPlugin:  Activate the isolation plugin to isolate changes to external modules to a single test module or package. The isolation plugin resets the contents of sys.modules after each test module or package runs to its state before the test. PLEASE NOTE that this plugin should not be used with
the coverage plugin, or in any other case where module reloading may produce undesirable side-effects.

#### detailed_errors
Type: `Boolean`  
Default: false

Add detail to error output by attempting to evaluate failed asserts.

#### with_profile
Type: `Boolean`  
Default: false

Enable plugin Profile:  Use this plugin to run tests using the hotshot profiler.

#### profile_sort
Type: `String`

Set sort order for profiler output.

#### profile_stats_file
Type: `String`

Profiler stats file; default is a new temp file on each run.

#### profile_restrict
Type: `String`

Restrict profiler output. See help for pstats.Stats for details.

#### no_skip
Type: `Boolean`  
Default: false

Disable special handling of SkipTest exceptions.

#### with_id
Type: `Boolean`  
Default: false

Enable plugin TestId:  Activate to add a test id (like #1) to each test name output. Activate with `options.failed` to rerun failing tests only.

#### id_file
Type: `String`

Store test ids found in test runs in this file. Default is the file .noseids in the working directory.

#### failed
Type: `Boolean`  
Default: false

Run the tests that failed in the last test run.

#### processes
Type: `Number`  
Default: 0

Spread test run among this many processes. Set a number equal to the number of processors or cores in your machine for best results. Pass a negative number to have the number of processes automatically set to the number of cores. Passing 0 means to disable parallel testing. Default is 0 unless NOSE_PROCESSES is
set.

#### process_timeout
Type: `Number`  
Default: 10

Set timeout for return of results from each test runner process.

#### process_restartworker
Type: `Boolean`  
Default: false

If set, will restart each worker process once their tests are done, this helps control memory leaks from killing the system.

#### virtualenv
Type: `String`

Run the unit tests in this virtualenv.

#### externalNose
Type: `Boolean`  

Use nose modules from python interpreter in path.

#### with_xunit
Type: `Boolean`  
Default: false

Enable plugin Xunit: This plugin provides test results in the standard XUnit XML format.

#### xunit_file
Type: `String`  
Default: 'nosetests.xml'

Path to xml file to store the xunit report in.

#### all_modules
Type: `Boolean`  
Default: false

Enable plugin AllModules: Collect tests from all python modules.

#### collect_only
Type: `Boolean`  
Default: false

Enable collect-only:  Collect and output test names only, don't run any tests.

### Usage Examples

In the simplest case, run nose without any arguments at all. This would make nose scan for tests, and execute whatever it finds.

```js
grunt.initConfig({
  nose: {
    main: { }
  },
})
```

A bit more practical though is to utilize some of the power of nose, so if we want code coverage in HTML, we're writing doctests, and we'd like to see the results as a XUnit report, do the following: (note that coverage must be installed separatly, f. ex in a virtualenv specified by `options.virtualenv`)

```js
grunt.initConfig({
  nose: {
    options: {
      virtualenv: 'my_app_venv',
      with_coverage: true,
      cover_package: "mypackage",
      cover_branches: true,
      cover_xml: true,
      coverage_html: true,
      coverage_html_dir: 'code_coverage',
      virtualenv: 'my_app_venv',
      with_doctest: true,
      with_xunit: true,
    },
  },
})
```

## Contributing
To fetch the nose libs, run `npm run-script devsetup`, that should install everything you need.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
