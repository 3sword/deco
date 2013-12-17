'use strict';

/* Filters */

var decoFilters = angular.module('decoFilters', []);

decoFilters.filter('interpolate', [ 'version', function(version) {
    return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    }
} ]);
