'use strict';

describe('Filter: flagFilter', function () {

  // load the filter's module
  beforeEach(module('YeoAngular'));

  // initialize a new instance of the filter before each test
  var flagFilter;
  beforeEach(inject(function ($filter) {
    flagFilter = $filter('flagFilter');
  }));

  it('should return the input prefixed with "flagFilter filter:"', function () {
    var text = 'angularjs';
    expect(flagFilter(text)).toBe('flagFilter filter: ' + text);
  });

});
