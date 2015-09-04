'use strict';

describe('Directive: bindTimestampToDate', function () {

  // load the directive's module
  beforeEach(module('progressTimerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bind-timestamp-to-date></bind-timestamp-to-date>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bindTimestampToDate directive');
  }));
});
