'use strict';

var chartsApp = angular.module('chartsApp', [
    // imports
    'ui.router',
    
    // main app
    'chartsControllers',
    'chartsDirectives',
    'chartsServices',
]);
var thisApp = chartsApp;
var sector = "cannabis"; // temp

thisApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    // $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({enabled: true});
    // $httpProvider.defaults.headers.common['X-CSRFToken'] = document.getElementById('pycsrf') && document.getElementById('pycsrf').value;

    // states are set up in submodules
    $stateProvider
        .state('main', {
            url: '/?exchanges&tags&search',
            templateUrl: '/static/charts/html/main.html',
            controller: 'mainCtrl',
        })
        .state('main.stock', {
            url: ':ticker/',
            templateUrl: '/static/charts/html/stock.html',
            controller: 'stockCtrl',
        })
});


// CACHE BUSTING

// DO NOT CACHE THE TEMPLATES WITH UI ROUTER
var CACHEBUSTER = Date.now().toString();
function configureTemplateFactory($provide) {
    // Set a suffix outside the decorator function
    function templateFactoryDecorator($delegate) {
        var fromUrl = angular.bind($delegate, $delegate.fromUrl);
        $delegate.fromUrl = function (url, params) {
            if (url !== null && angular.isDefined(url) && angular.isString(url)) {
                url += (url.indexOf("?") === -1 ? "?" : "&");
                url += "v=" + CACHEBUSTER;
            }
            return fromUrl(url, params);
        };
        return $delegate;
    }
    $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
}
thisApp.config(['$provide', configureTemplateFactory]);
