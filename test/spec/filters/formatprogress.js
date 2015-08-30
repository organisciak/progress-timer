'use strict';

describe('Filter: formatProgress', function () {

  // load the filter's module
  beforeEach(module('progressTimerApp'));

  // initialize a new instance of the filter before each test
  var formatProgress;
  beforeEach(inject(function ($filter) {
    formatProgress = $filter('formatProgress');
  }));

  it('should return the input prefixed with "formatProgress filter:"', function () {
    var text = 'angularjs';
    expect(formatProgress(text)).toBe('formatProgress filter: ' + text);
  });

});
