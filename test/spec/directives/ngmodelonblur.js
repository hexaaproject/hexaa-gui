'use strict';

describe('Directive: ngModelOnBlur', function () {

  // load the directive's module
  beforeEach(module('hexaaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-model-on-blur></ng-model-on-blur>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
