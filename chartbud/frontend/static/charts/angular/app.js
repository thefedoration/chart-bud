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
    
    // states are set up in submodules
    $stateProvider
        .state('main', {
            url: '/?exchanges&tags&search&ordering&favorite',
            templateUrl: '/static/charts/html/main.html',
            controller: 'mainCtrl',
        })
        .state('main.stock', {
            url: ':ticker/',
            templateUrl: '/static/charts/html/stock.html',
            controller: 'stockCtrl',
        })
        .state('main.stock.company', {
            url: 'company/',
            templateUrl: '/static/charts/html/stock-company.html',
            // controller: 'stockCompanyCtrl',
        })
        .state('main.stock.news', {
            url: 'news/',
            templateUrl: '/static/charts/html/stock-news.html',
            // controller: 'stockNewsCtrl',
        })
        .state('main.stock.premarket', {
            url: 'premarket/',
            templateUrl: '/static/charts/html/stock-premarket.html',
            // controller: 'stockPremarketCtrl',
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
