'use strict';

describe('Service: msToTimeString', function () {

  // load the service's module
  beforeEach(module('progressTimerApp'));

  // instantiate service
  var msToTimeString;
  beforeEach(inject(function (_msToTimeString_) {
    msToTimeString = _msToTimeString_;
  }));

  it('should instantiate', function () {
    expect(!!msToTimeString).toBe(true);
  });

  it('should format all units properly', function () {
    expect(msToTimeString(444857000)).toEqual("5 days 3:34");
  });

  it('should pluralize and pad properly', function () {
    var out = msToTimeString(90061000);
    expect(out).toEqual("1 day 1:01");
  });

  it('should floor remaining milliseconds', function () {
    var out = msToTimeString(90061234);
    expect(out).toEqual("1 day 1:01");
  });

  it('should only show necessary parts', function () {
    expect(msToTimeString(1000)).toEqual("1");
    expect(msToTimeString(60000)).toEqual("1:00");
    expect(msToTimeString(70000)).toEqual("1:10");
    expect(msToTimeString(3600000)).toEqual("1:00:00");
    // No seconds when showing days
    expect(msToTimeString(86401000)).toEqual("1 day");
    expect(msToTimeString(86461000)).toEqual("1 day 0:01");
    expect(msToTimeString(86460000)).toEqual("1 day 0:01");
  });

  it('should include zeros', function () {
    expect(msToTimeString(3601000)).toEqual("1:00:01");
  });

    it('should only accept numeric values', function () {
      expect(function(){msToTimeString("444857000")}).toThrowError(TypeError);
  });

});
