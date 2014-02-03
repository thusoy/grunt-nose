var fs = require('fs'),
  parseString = require('xml2js').parseString;


// Extract number of tests, errors, failures, skips and a list of tests run from a report
exports.parseReport = function (reportName, callback) {
  fs.readFile('reports/' + reportName + '.xml', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    parseString(data, function (err, results) {
      var testData = {
        'numTests': results.testsuite.$.tests,
        'numErrors': results.testsuite.$.errors,
        'numFailures': results.testsuite.$.failures,
        'numSkips': results.testsuite.$.skip,
      };
      testData.numSuccess = testData.numTests - testData.numErrors - testData.numFailures - testData.numSkips;
      callback(testData);
    });
  });
};

exports.readReport = function (reportName, callback) {
  fs.readFile('reports/' + reportName + '.xml', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    callback(data);
  });
};
