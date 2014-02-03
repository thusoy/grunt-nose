var testutils = require('./testutils.js');

exports.testVenv = function (test) {
  test.expect(2);
  testutils.parseReport('virtualenv', function (testData) {
    test.equal(testData.numTests, 1);
    test.equal(testData.numSuccess, 1);
    test.done();
  });
};

exports.testCustomOptions = function (test) {
  test.expect(2);
  testutils.parseReport('doctest', function (testData) {
    test.equal(testData.numTests, 1);
    test.equal(testData.numSuccess, 1);
    test.done();
  });
};

exports.testExclude = function (test) {
  test.expect(2);
  testutils.parseReport('exclude', function (testData) {
    test.equal(testData.numTests, 1);
    test.equal(testData.numSuccess, 1);
    test.done();
  });
};

exports.testSpecificTests = function (test) {
  test.expect(2);
  testutils.parseReport('specificTests', function (testData) {
    test.equal(testData.numTests, 2);
    test.equal(testData.numSuccess, 2);
    test.done();
  });
};
