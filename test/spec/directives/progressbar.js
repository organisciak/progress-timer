'use strict';

describe('Directive: progressBar', function () {

  // load the directive's module
  beforeEach(module('progressTimerApp'));

  var element,
    scope,
    $httpBackend;


  beforeEach(module('views/progressbar.html'));
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('[Clock type bar]', function () {
    var now = (new Date()).getTime();
    var bar = { 
      "name": "Title", 
      "note": "Description", 
      "start": now - 3600000, 
      "current": now, 
      "end": now + 3600000, 
      "type": "clock"};

    beforeEach(inject(function ($compile) {
      element = angular.element('<progress-bar></progress-bar>');
      scope.bar = bar;
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should populate elements with bar details', function () {
      expect(element.find('h2').text()).toBe(scope.bar.name);
      expect(element.find('.description').text()).toBe(scope.bar.note);
      expect(element.find('.progress-bar').hasClass('active')).toBe(true);
    });

    it('should calculate proper percentage', function () {
      expect(Math.round(scope.bar.percentile)).toBe(50);
    });

    it('should update old schema', function() {
      expect(scope.bar.running).toBe(true);
    });

    it('should overextend properly', inject(function ($compile) {
      scope.bar.end = now - 1800000;
      element = $compile(element)(scope);
      scope.$digest();

      expect(scope.bar.overextend).toBe(true);
      expect(element.find('.progress-bar').hasClass('progress-bar-danger')).toBe(true);
      expect(scope.bar.percentile).toBe(100);
    }));
  });
  
});
