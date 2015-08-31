'use strict';

describe('Service: msToTimeUnits', function () {

  // load the service's module
  beforeEach(module('progressTimerApp'));

  // instantiate service
  var msToTimeUnits;
  beforeEach(inject(function (_msToTimeUnits_) {
    msToTimeUnits = _msToTimeUnits_;
  }));

  it('should instantiate', function () {
    expect(!!msToTimeUnits).toBe(true);
  });

  it('should count time units properly', function () {
    var ms = 444857000,
        out = msToTimeUnits(ms);
    expect(out.days).toEqual(5);
    expect(out.hours).toEqual(3);
    expect(out.minutes).toEqual(34);
    expect(out.seconds).toEqual(17);
  });

  it('should deal with zeros', function () {
    var ms = 1000,
        out = msToTimeUnits(ms);
    expect(out).toEqual(jasmine.objectContaining({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1
    }));
  });

  it('should floor remaining milliseconds', function () {
    var ms = 1234,
        out = msToTimeUnits(ms);
    expect(out.days).toEqual(0);
    expect(out.hours).toEqual(0);
    expect(out.minutes).toEqual(0);
    expect(out.seconds).toEqual(1);
  });

    it('should only accept numeric values', function () {
    var ms = 1234,
        out = msToTimeUnits(ms);
    expect(function(){msToTimeUnits("444857000")}).toThrowError(TypeError);
  });
});
