'use strict';

describe('Service: msToTimeString', function () {

  // load the service's module
  beforeEach(module('progressTimerApp'));

  // instantiate service
  var msToTimeString;
  beforeEach(inject(function (_msToTimeString_) {
    msToTimeString = _msToTimeString_;
  }));

  it('should do something', function () {
    expect(!!msToTimeString).toBe(true);
  });

});
