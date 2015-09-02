'use strict';

describe('Filter: formatProgress', function () {

  // load the filter's module
  beforeEach(module('progressTimerApp'));

  // initialize a new instance of the filter before each test
  var formatProgress;
  beforeEach(inject(function ($filter) {
    formatProgress = $filter('formatProgress');
  }));

  it('should format counters properly:"', function () {
    var text = 'angularjs';
    expect(formatProgress(33855, 'counter')).toBe(33855);
  });

  it('should format clocks properly:"', function () {
    expect(formatProgress(1441232227382, 'clock')).toBe("Sep 2, 2015 4:17 PM");
  });

  
  it('should format timers properly:"', function () {
    // Timer formatting should be covered by unit tests for msToTimeString
    // service tests
    // This test only looks at whether that service is used properly 
    expect(formatProgress(86460000, 'timer')).toBe("1 day 0:01");
  });

});
