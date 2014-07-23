'use strict';

describe('Module: BrowserCache', function () {

  // load the controller's module
  beforeEach(module('BrowserCache'));

  it('should contain a browserCacheManager service', inject(function(browserCacheManager) {
    expect(browserCacheManager).not.toEqual(null);
  }));

  it('should have a working browserCacheManager',
    inject(['browserCacheManager', function(browserCacheManager) {
      expect(browserCacheManager.get('test/123?q=23')).toBe(-1);
      expect(browserCacheManager.get('test/456')).toBe(-1);
      expect(browserCacheManager.invalidateResourceCache('test/123'));
      expect(browserCacheManager.get('test/123?q=0978&p=123')).toBe(-2);
      expect(browserCacheManager.get('test/456')).toBe(-1);
    }]));

  it('should have a working browserCacheInterceptor',
    inject(['browserCacheInterceptor', function(browserCacheInterceptor) {
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'GET'}).url).toBe('/test/1?rev=-1');
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'POST'}).url).toBe('/test/1');
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'GET'}).url).toBe('/test/1?rev=-2');
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'GET'}).url).toBe('/test/1?rev=-2');
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'DELETE'}).url).toBe('/test/1');
      expect(browserCacheInterceptor.request({url: '/test/1', method: 'GET'}).url).toBe('/test/1?rev=-3');
    }]));

  it('test the custom cache rule', function() {
    var m;
    module(function($browserCacheProvider) {
      m = $browserCacheProvider;
      $browserCacheProvider.addCustomCacheRule(/anotherUrl/, /test/);
    });

    inject(['browserCacheInterceptor', function(browserCacheInterceptor) {
      expect(m).toBeDefined();
      expect(browserCacheInterceptor.request({url: '/test/2', method: 'GET'}).url).toBe('/test/2?rev=-1');
      expect(browserCacheInterceptor.request({url: '/test/2', method: 'GET'}).url).toBe('/test/2?rev=-1');
      expect(browserCacheInterceptor.request({url: '/anotherUrl/3', method: 'POST'}).url).toBe('/anotherUrl/3');
      expect(browserCacheInterceptor.request({url: '/test/2', method: 'GET'}).url).toBe('/test/2?rev=-2');
      expect(browserCacheInterceptor.request({url: '/lolcat/1', method: 'GET'}).url).toBe('/lolcat/1?rev=-1');
    }]);
  });

});
