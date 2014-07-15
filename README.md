angular-browser-cache-manager
=============================

This is a module for AngularJS that provides the ability to have control over the browser cache XHR requests

What does it do?
---------------

This module intercept $http GET requests and bypass browser cache if needed.

How?
---------------

When a POST, PUT, PATCH or a DELETE request on the FOO resource occurs, the next GET request on the same resource will retrieve fresh data from the server and not from the browser cache.

Examples
---------------

- GET on `/user/1` will be intercepted and trasformed into GET on `/user/1?rev=-1`
- POST on `/user/1`
- GET on `/user/1` will be intercepted and trasformed into GET on `/user/1?rev=-2`
- GET on `/user/1` will be `/user/1?rev=-2`

Note that the last GET have the same rev parameter of the previous GET request.

- POST on `/users?myParameter=1`
- GET on `/users?myParameter=2` will be intercepted and trasformed into GET on `/users?myParameter=2&rev=-1`
- POST on `/users?myParameter=123`
- GET on `/users` will be intercepted and trasformed into GET on `/users?rev=-2`
- GET on `/users?myParameter=123` will be intercepted and trasformed into GET on `/users?myParameter=123&rev=-2`
- GET on `/users` will be intercepted and trasformed into GET on `/users?rev=-2`
- POST on `/users`
- GET on `/users?myParameter=123` will be intercepted and trasformed into GET on `/users?myParameter=123&rev=-3`

Note that the rev value depends ONLY on the URL value (/users in the above example) and ignore any query parameters (like myParameter in the above example).


How to install:
---------------

 * Install it with Bower via `bower install angular-browser-cache-manager --save`

 * Ensure that your application module specifies `BrowserCache` as a dependency: `angular.module('myApplication', ['BrowserCache'])`
 
 * Push the `browserCacheInterceptor` interceptor to the $http interceptors lists

```
myApplication
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('browserCacheInterceptor');
  }]);
```


**Things to notice:**
If you want to change the name of the rev parameter:

```
myApplication
  .config(function($stateProvider, $urlRouterProvider, $browserCacheProvider) {
    $browserCacheProvider.setHashParameter('manuel');
  });
```
