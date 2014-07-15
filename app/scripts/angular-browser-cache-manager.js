'use strict';

angular
  .module('BrowserCache', [])
  .service('browserCacheManager', ['$cacheFactory', function ($cacheFactory) {
    var defaultHash = -1, cacheName = 'BrowserCache';
    var cleanURLParams = function (URL) {
      var newURL = URL, oldURL = URL, index = oldURL.indexOf('?');
      if (index === -1) {
        index = oldURL.indexOf('#');
      }
      if (index !== -1) {
        newURL = oldURL.substring(0, index);
      }
      return newURL;
    };
    // get cacheFactory service
    this.__cacheFactory = this.__cacheFactory || $cacheFactory(cacheName);
    this.get = function (specialKey) {
      specialKey = cleanURLParams(specialKey);
      // retrieve the hash parameter value from cache or initialize it
      var hash = this.__cacheFactory.get(specialKey) || this.__cacheFactory.put(specialKey, defaultHash);
      return hash;
    };
    this.invalidateResourceCache = function (specialKey) {
      specialKey = cleanURLParams(specialKey);
      var hash = this.__cacheFactory.get(specialKey);
      if (hash) {
        // decrement hash value so the next GET on specialKey resource will not returns the cached one
        this.__cacheFactory.put(specialKey, Number(hash) - 1);
      }
    };
  }])
  .factory('browserCacheInterceptor', ['$q', 'browserCacheManager', function ($q, browserCacheManager) {
    var hashParameter = 'rev';
    return {
      request: function (config) {
        // not retrieving a template .html
        if (config.url.indexOf('.html') === -1) {
          // append the cache parameter to the request
          if (config.method === 'GET') {
            // create 'foo=bar'
            var someMilk = hashParameter + '=' + browserCacheManager.get(config.url);
            // append the hash parameter to URL
            config.url += (config.url.split('?')[1] ? '&' : '?') + someMilk;
          } else if (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') {
            // on POST PUT PATCH change (decrement) the hash parameter
            browserCacheManager.invalidateResourceCache(config.url);
          }
        }

        return config || $q.when(config);
      }
    };
  }]);
