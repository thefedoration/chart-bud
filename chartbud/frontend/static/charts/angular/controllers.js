
var chartsControllers = angular.module('chartsControllers', ['angular-inview', 'ngStorage',]);
chartsControllers.controller('mainCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$interval', '$localStorage', 'Stock',
    function($rootScope, $scope, $state, $timeout, $interval, $localStorage, Stock) {

        // PARAMS
        ///////////////////////////////
        $scope.state = $state;
        $scope.stockPromise; // inits promise used in querying stocks
        $scope.stocks = {loading: false, results: []};
        $scope.refreshOn = true;
        $rootScope.$localStore = $localStorage;
        $rootScope.$localStore['favorites'] = $rootScope.$localStore['favorites'] || {};

        // METHODS
        ///////////////////////////////
        
        // gets list of stocks based on filter params
        $scope.filterStocks = function(){
            $scope.stocks.loading = true;
            $timeout.cancel($scope.stockPromise); // cancels any old timeout promises
            $scope.stockPromise = $timeout(function(){ // waits 250 ms and executes if there isn't a new request
            
                // gets query params, updates stocks list
                $scope.queryParams = $scope.getQueryParams();
                Stock.filter($scope.queryParams)
                .success(function(data){
                    $scope.stocks.loading = false;
                    $scope.stocks.results = data.results
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
            if ($state.params.favorite == 'true'){
                queryParams['ticker__in'] = $scope.getFavorites();
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
        
        // sets a stock as favorited or not
        $rootScope.setFavorite = function(stock, isFavorite){
            $rootScope.$localStore['favorites'][stock.ticker] = isFavorite;
        }
        
        // clears filters by removing all url params besides ticker
        $scope.clearFilters = function(){
            var params = angular.copy($state.params);
            Object.keys(params).forEach(function(key){
                params[key] = (key=="ticker") ? params[key] : undefined;
            });
            window.location.href = $state.href($state.current.name, params);
        }
        
        // UTILS
        ///////////////////////////////
        
        // checks localstore if this stock is favorites
        $rootScope.isFavorite = function(stock){
            if ($rootScope.$localStore['favorites'][stock.ticker]){
                return true;
            }
            return false;
        }
        
        // gets list of favorite tickers
        $scope.getFavorites = function(){
            return Object.keys($rootScope.$localStore['favorites']).filter(function(key){
                return $rootScope.$localStore['favorites'][key] == true;
            });
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
        $scope.state = $state;
        $scope.timespans = ["1d", "5d", "1m", "3m", "1y", "max"];
        $scope.chartPromise; // inits promise used in querying for chart

        // METHODS
        ///////////////////////////////
        
        // load up the stock if we don't have it already
        $scope.getStock = function(){
            $scope.loading = true;
            Stock.get($state.params.ticker)
            .success(function(data){
                $scope.loading = false;
                $scope.stock = data;
            });
        }
        
        $scope.getChart = function(timespan){
            var params = {
                'timespan': timespan || $state.params.timespan || '1d'
            }
            
            $scope.loadingChart = true;
            // $timeout.cancel($scope.chartPromise); // cancels any old timeout promises
            // console.log(angular.copy($scope.chartPromise))
            // $scope.chartPromise = $timeout(function(){ // waits 250 ms and executes if there isn't a new request
                $scope.loadingChart = true;
                console.log($scope.chartPromise);
                $scope.currentRequest = Stock.getChart($state.params.ticker, params)
                .success(function(data){
                    console.log($scope.chartPromise);
                    $scope.loadingChart = false;
                    $scope.chartData = data;
                    console.log(data);
                    console.log($scope.currentRequest)
                });
                console.log($scope.currentRequest)
            // }, 250);
        }
        
        // ACTIONS
        // /////////////////////
        
        $scope.setTimespan = function(timespan){
            var params = angular.copy($state.params);
            params['timespan'] = (timespan=="1d") ? undefined : timespan;
            $state.go($state.current.name, params, {'notify': false});
            $scope.getChart(timespan);
        }
        
        // user toggles a ticker as favorite or not
        $scope.setFavorite = $rootScope.setFavorite;

        // UTILS
        // /////////////////////
        $scope.isFavorite = $rootScope.isFavorite;
        
        $scope.caps = function(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        // WATCHERS
        ///////////////////////////////

        // INIT
        ///////////////////////////////
        $scope.getStock();
        $scope.getChart();
    }
]);
