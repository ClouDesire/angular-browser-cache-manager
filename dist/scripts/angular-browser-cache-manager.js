"use strict";angular.module("BrowserCache",[]).provider("$browserCache",function(){var a="rev";return{setHashParameter:function(b){a=b},$get:function(){return a}}}).service("browserCacheManager",["$cacheFactory",function(a){var b=-1,c="BrowserCache",d=function(a){var b=a,c=a,d=c.indexOf("?");return-1===d&&(d=c.indexOf("#")),-1!==d&&(b=c.substring(0,d)),b};this.__cacheFactory=this.__cacheFactory||a(c),this.get=function(a){a=d(a);var c=this.__cacheFactory.get(a)||this.__cacheFactory.put(a,b);return c},this.invalidateResourceCache=function(a){a=d(a);var b=this.__cacheFactory.get(a);b&&this.__cacheFactory.put(a,Number(b)-1)}}]).factory("browserCacheInterceptor",["$q","browserCacheManager","$browserCache",function(a,b,c){var d=c;return{request:function(c){if(-1===c.url.indexOf(".html"))if("GET"===c.method){var e=d+"="+b.get(c.url);c.url+=(c.url.split("?")[1]?"&":"?")+e}else("POST"===c.method||"PUT"===c.method||"PATCH"===c.method||"DELETE"===c.method)&&b.invalidateResourceCache(c.url);return c||a.when(c)}}}]);