
var chartsDirectives = angular.module('chartsDirectives', []);

chartsDirectives.directive('loadingAnimation', function($rootScope) {
    return {
        templateUrl: '/static/charts/html/directives/loading-animation.html' + '?v=' + Date.now().toString(),
    }
});

chartsDirectives.controller('exchangeFilterController', ['$scope', '$state', '$rootScope', 'Exchange',
    function($scope, $state, $rootScope, Exchange) {
        // Methods
        // /////////////////////

        // get options (from rootscope or new)
        $scope.getOptions = function(){
            if ($rootScope.exchanges){
                $scope.options = $rootScope.exchanges;
                $scope.setCurrentFromParams();
            } else {
                $scope.loading = true;
                Exchange.filter({})
                .success(function(data){
                    $rootScope.exchanges = data.results;
                    $scope.loading = false;
                    $scope.options = $rootScope.exchanges;
                    $scope.setCurrentFromParams();
                })
            }
        }
        
        // looks at params, determines which options are current
        $scope.setCurrentFromParams = function(){
            if ($state.params.exchanges){
                var currentSymbols = $state.params.exchanges.split(",");
                $scope.options.forEach(function(e){
                    e.current = currentSymbols.indexOf(e.symbol) !== -1
                });
            }
        }

        // ACTIONS
        // /////////////////////
        
        // navigate to current url but with updated parameters
        $scope.optionToggled = function(){
            var params = angular.copy($state.params);
            var current = $scope.options.filter(function(e){
                return e.current;
            })
            params['exchanges'] = (current.length) ? current.map(function(e){return e.symbol;}).join(",") : undefined;
            $state.go($state.current.name, params, {'notify': false});
            $scope.$parent.filterStocks();
        }

        // INIT
        // /////////////////////
        $scope.getOptions();
    }
]).directive('exchangeFilter', function($rootScope) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/static/charts/html/directives/exchange-filter.html' + '?v=' + Date.now().toString(),
        controller: 'exchangeFilterController'
    }
});

chartsDirectives.controller('tagFilterController', ['$scope', '$state', '$rootScope', 'Tag',
    function($scope, $state, $rootScope, Tag) {
        // Methods
        // /////////////////////

        // get options (from rootscope or new)
        $scope.getOptions = function(){
            if ($rootScope.tags){
                $scope.options = $rootScope.tags;
                $scope.setCurrentFromParams();
            } else {
                $scope.loading = true;
                Tag.filter({})
                .success(function(data){
                    $rootScope.tags = data.results;
                    $scope.loading = false;
                    $scope.options = $rootScope.tags;
                    $scope.setCurrentFromParams();
                })
            }
        }
        
        // looks at params, determines which options are current
        $scope.setCurrentFromParams = function(){
            if ($state.params.tags){
                var currentIds = $state.params.tags.split(",");
                $scope.options.forEach(function(t){
                    t.current = currentIds.indexOf(String(t.id)) !== -1
                });
            }
        }

        // ACTIONS
        // /////////////////////
        
        // navigate to current url but with updated parameters
        $scope.optionToggled = function(){
            var params = angular.copy($state.params);
            var current = $scope.options.filter(function(t){
                return t.current;
            })
            params['tags'] = (current.length) ? current.map(function(t){return t.id;}).join(",") : undefined;
            $state.go($state.current.name, params, {'notify': false});
            $scope.$parent.filterStocks();
        }

        // INIT
        // /////////////////////
        $scope.getOptions();
    }
]).directive('tagFilter', function($rootScope) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/static/charts/html/directives/tag-filter.html' + '?v=' + Date.now().toString(),
        controller: 'tagFilterController'
    }
});


chartsDirectives.controller('searchFilterController', ['$scope', '$state', '$rootScope',
    function($scope, $state, $rootScope) {
        // PARAMS
        // /////////////////////

        // ACTIONS
        // /////////////////////
        
        // looks at params, determines which options are current
        $scope.setCurrentFromParams = function(){
            if ($state.params.search){
                $scope.searchQuery = $state.params.search;
            }
        }

        // WATCHERS
        // /////////////////////
        
        $scope.searchQueryChanged = function(){
            var params = angular.copy($state.params);
            params['search'] = ($scope.searchQuery) ? $scope.searchQuery : undefined;
            $state.go($state.current.name, params, {'notify': false});
            $scope.$parent.filterStocks();
        }

        // INIT
        // /////////////////////
        $scope.setCurrentFromParams();
        $('#search-filter').focus();
    }
]).directive('searchFilter', function($rootScope) {
    return {
        restrict: 'E',
        scope:{},
        templateUrl: '/static/charts/html/directives/search-filter.html' + '?v=' + Date.now().toString(),
        controller: 'searchFilterController'
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
