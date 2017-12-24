
var chartsControllers = angular.module('chartsControllers', ['angular-inview']);
chartsControllers.controller('mainCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$interval', 'Stock',
    function($rootScope, $scope, $state, $timeout, $interval, Stock) {

        // PARAMS
        ///////////////////////////////
        $scope.state = $state;
        $scope.timeoutPromise; // inits promise used in querying stocks
        $scope.stocks = {loading: false, results: []};
        $scope.refreshOn = true;

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
                    
                    $('#sidebar-tickers').scrollTop(0)
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
            if ($state.params.ordering){
                queryParams['ordering'] = $state.params.ordering;
            }
            return queryParams;
        }
        
        // pings server for updated numbers for current tickers
        $scope.updateCurrentStocks = function(){
            if (!$scope.stocks.loading){
                var tickers = $scope.stocks.results.map(a => a.ticker)
                Stock.filter({'ticker__in':tickers.join(","), 'limit': tickers.length})
                .success(function(data){
                    // iterate over each stock we got back, update the one in the sidebar
                    data.results.forEach(function(r){
                        var stock = $scope.stocks.results.filter(s => s.ticker == r.ticker)[0];
                        
                        if (stock){
                            // update values
                            stock.tickDifference = r.current - stock.current;
                            stock.current = r.current;
                            stock.daily_diff = r.daily_diff;
                            stock.daily_diff_percent = r.daily_diff_percent;
                            stock.volume = r.volume;
                            
                            // update tick difference after 2s back to 0
                            $timeout(() => stock.tickDifference = null, 2000);
                        }
                    })
                });
            }
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
        
        // create interval polling function to continuously update current list
        $scope.refreshInterval = $interval(function(){
            if ($scope.refreshOn){
                $scope.updateCurrentStocks();
            }
        }, 1000 * 20);
        
        // Make sure that the interval is destroyed
        $scope.$on('$destroy', function() {
            if ($scope.refreshInterval){
                $interval.cancel($scope.refreshInterval);
                $scope.refreshInterval = undefined;
            }
        });

        // INIT
        ///////////////////////////////
        $scope.filterStocks();
    }
]);


chartsControllers.controller('stockCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'Stock',
    function($rootScope, $scope, $state, $timeout, Stock) {

        // PARAMS
        ///////////////////////////////

        // METHODS
        ///////////////////////////////
        
        $scope.getStock = function(){
            $scope.loading = true;
            Stock.get($state.params.ticker)
            .success(function(data){
                $scope.loading = false;
                $scope.stock = data;
            })
        }
        
        // ACTIONS
        ///////////////////////////////
        
        // WATCHERS
        ///////////////////////////////

        // INIT
        ///////////////////////////////
        $scope.getStock();
    }
]);
