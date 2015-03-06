'use strict';

describe('Directive: SuggestBox', function () {

  // load the directive's module
  beforeEach(module('hexaaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-suggest-box></-suggest-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('<-suggest-box>');
  }));
});
