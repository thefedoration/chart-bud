
var chartsControllers = angular.module('chartsControllers', ['angular-inview']);
chartsControllers.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'Stock',
    function($rootScope, $scope, $state, Stock) {

        // PARAMS
        ///////////////////////////////
        // $rootScope.previousParams = {};
        $scope.stocks = {loading: false, results: [], current: []}

        // METHODS
        ///////////////////////////////
        
        // gets list of stocks based on filter params
        $scope.filterStocks = function(){
            $scope.stocks.loading = true;
            $scope.queryParams = $scope.getQueryParams();
            Stock.filter($scope.queryParams)
            .success(function(data){
                $scope.stocks.loading = false;
                $scope.stocks.results = data.results;
                $scope.stocks.next = data.next;
            })
        }
        
        // gets the api query oarams from the current page query params
        $scope.getQueryParams = function(){
            var queryParams = {};
            if ($state.params.exchanges){
                queryParams['exchange__symbol__in'] = $state.params.exchanges.split(",");
            }
            if ($state.params.tags){
                queryParams['company__tags__id__in'] = $state.params.tags.split(",");
            }
            if ($state.params.search){
                queryParams['search'] = $state.params.search;
            }
            return queryParams;
        }
        
        // ACTIONS
        ///////////////////////////////
        
        // triggered by inview element
        $scope.loadMoreStocks = function(){
            if ($scope.stocks.next && !$scope.stocks.loading){
                $scope.stocks.loading = true;
                Stock.getUrl($scope.stocks.next)
                .success(function(data){
                    $scope.stocks.loading = false;
                    $scope.stocks.results = $scope.stocks.results.concat(data.results);
                    $scope.stocks.next = data.next;
                })
            }
        }
        
        // WATCHERS
        ///////////////////////////////

        // INIT
        ///////////////////////////////
        $scope.filterStocks();
    }
]);
