
var chartsDirectives = angular.module('chartsDirectives', []);

chartsDirectives.directive('exchangeFilter', function($rootScope) {
    return {
        templateUrl: '/static/charts/html/directives/exchange-filter.html' + '?v=' + Date.now().toString(),
    }
});

chartsDirectives.directive('tagFilter', function($rootScope) {
    return {
        templateUrl: '/static/charts/html/directives/tag-filter.html' + '?v=' + Date.now().toString(),
    }
});


chartsDirectives.controller('sidebarTickerController', ['$scope', '$state', '$rootScope',
    function($scope, $state, $rootScope) {
        // PARAMS
        // /////////////////////

        // ACTIONS
        // /////////////////////

        // WATCHERS
        // /////////////////////

        // INIT
        // /////////////////////
    }
]).directive('sidebarTicker', function($rootScope) {
    return {
        restrict: 'E',
        scope:{
            'stock': '=',
        },
        templateUrl: '/static/charts/html/directives/sidebar-ticker.html' + '?v=' + Date.now().toString(),
        controller: 'sidebarTickerController'
    }
});
