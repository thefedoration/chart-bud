'use strict';

var chartsServices = angular.module('chartsServices', []);

chartsServices.factory('Exchange', ['$http',
    function($http){
      	var ExchangeMethods = {};
      	// AuthMethods.filterExchanges = function(query) {
    	// 	return $http({
    	// 		method: 'POST',
    	// 		url: '/auth/login/',
    	// 		data: user
    	// 	});
    	// }
        ExchangeMethods.filter = function(params) {
			return $http.get('/api/stocks/exchanges/'+toQueryString(params));
		}
    	return ExchangeMethods;
}]);


chartsServices.factory('Company', ['$http',
    function($http){
      	var CompanyMethods = {};
        CompanyMethods.filter = function(params) {
			return $http.get('/api/stocks/companies/'+toQueryString(params));
		}
    	return CompanyMethods;
}]);


chartsServices.factory('Tag', ['$http',
    function($http){
      	var TagMethods = {};
        TagMethods.filter = function(params) {
			return $http.get('/api/stocks/tags/'+toQueryString(params));
		}
    	return TagMethods;
}]);


chartsServices.factory('Stock', ['$http',
    function($http){
      	var StockMethods = {};
        StockMethods.filter = function(params) {
			return $http.get('/api/stocks/stocks/'+toQueryString(params));
		}
        StockMethods.getUrl = function(url) {
			return $http.get(url);
		}
        StockMethods.get = function(ticker) {
			return $http.get('/api/stocks/stocks/'+ticker+'/');
		}
    	return StockMethods;
}]);

