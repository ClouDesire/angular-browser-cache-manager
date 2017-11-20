'use strict';

angular
  .module('BrowserCache', ['angular-data.DSCacheFactory'])
  .provider('$browserCache', function() {
    var obj = {
      hashParameter: 'rev',
      customCacheMap: []
    };
    return {
      setHashParameter: function(hashParameter) {
        obj.hashParameter = hashParameter;
      },
      addCustomCacheRule: function(requestPattern, destinationPattern) {
        if(!requestPattern instanceof RegExp || !destinationPattern instanceof RegExp) {
          throw new SyntaxError('addCustomCacheRule arguments must be an instance of RexExp');
        }
        obj.customCacheMap.push({'requestPattern': requestPattern, 'destinationPattern': destinationPattern});
      },
      cleanCustomCacheRules: function() {
        obj.customCacheMap = [];
      },
      $get: function() {
        return obj;
      }
    };
  })
  .service('browserCacheManager', ['DSCacheFactory', '$browserCache', function (DSCacheFactory, $browserCache) {
    var defaultHash = -1, cacheName = 'BrowserCache';
    var customCacheMap = $browserCache.customCacheMap;
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
    this.__cacheFactory = this.__cacheFactory || new DSCacheFactory(cacheName, {storageMode: 'localStorage'});
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
      // custom cache rules
      for(var i = 0, l = customCacheMap.length; i < l; i++) {
        if(customCacheMap[i].requestPattern.test(specialKey)) {
          var cacheKeys = this.__cacheFactory.keys();
          for(var e = 0, k = cacheKeys.length; e < k; e++) {
            if(customCacheMap[i].destinationPattern.test(cacheKeys[e])) {
              hash = this.__cacheFactory.get(cacheKeys[e]);
              if(hash) {
                this.__cacheFactory.put(cacheKeys[e], Number(hash) - 1);
              }
            }
          }
        }
      }
    };
  }])
  .factory('browserCacheInterceptor', ['$q', 'browserCacheManager', '$browserCache', function($q, browserCacheManager, $browserCache) {
    var hashParameter = $browserCache.hashParameter;
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
          } else if (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH' || config.method === 'DELETE') {
            // on POST PUT PATCH change (decrement) the hash parameter
            browserCacheManager.invalidateResourceCache(config.url);
          }
        }

        return config || $q.when(config);
      }
    };
  }]);
