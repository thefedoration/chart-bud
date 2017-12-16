
var chartsControllers = angular.module('chartsControllers', ['angular-inview']);
chartsControllers.controller('mainCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'Stock',
    function($rootScope, $scope, $state, $timeout, Stock) {

        // PARAMS
        ///////////////////////////////
        // $rootScope.previousParams = {};
        $scope.timeoutPromise; // inits promise used in querying stocks
        $scope.stocks = {loading: false, results: []}

        // METHODS
        ///////////////////////////////
        
        // gets list of stocks based on filter params
        $scope.filterStocks = function(){
            $scope.stocks.loading = true;
            $timeout.cancel($scope.timeoutPromise); // cancels any old timeout promises
            $scope.timeoutPromise = $timeout(function(){ // waits 250 ms and executes if there isn't a new request
            
                // gets query params, updates stocks list
                $scope.queryParams = $scope.getQueryParams();
                Stock.filter($scope.queryParams)
                .success(function(data){
                    $scope.stocks.loading = false;
                    $scope.stocks.results = data.results;
                    $scope.stocks.count = data.count;
                    $scope.stocks.next = data.next;
                })
            }, 250);
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
                $scope.stocks.loadingMore = true;
                Stock.getUrl($scope.stocks.next)
                .success(function(data){
                    $scope.stocks.loadingMore = false;
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
