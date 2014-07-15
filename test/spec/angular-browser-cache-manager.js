'use strict';

describe('Module: BrowserCache', function () {

  // load the controller's module
  beforeEach(module('BrowserCache'));

  it('should contain a browserCacheManager service', inject(function(browserCacheManager) {
    expect(browserCacheManager).not.toEqual(null);
  }));

  it('should have a working browserCacheManager',
    inject(['browserCacheManager', function(browserCacheManager) {
      //spyOn(browserCacheManager, 'get');
      expect(browserCacheManager.get('test/123?q=23')).toBe(-1);
      expect(browserCacheManager.get('test/456')).toBe(-1);
      expect(browserCacheManager.invalidateResourceCache('test/123'));
      expect(browserCacheManager.get('test/123?q=0978&p=123')).toBe(-2);
      expect(browserCacheManager.get('test/456')).toBe(-1);
    }]));
});
