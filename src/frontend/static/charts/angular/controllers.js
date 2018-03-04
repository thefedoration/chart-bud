
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
                            $timeout(() => stock.tickDifference = null, 500);
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
            $rootScope.$localStore['favorites'][stock.ticker] = (isFavorite) ? true : false;
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

chartsControllers.controller('stockCtrl', ['$rootScope', '$scope', '$state', 'Stock',
    function($rootScope, $scope, $state, Stock) {

        // PARAMS
        ///////////////////////////////
        $scope.state = $state;


        // METHODS
        ///////////////////////////////
        
        // load up the stock if we don't have it already
        $scope.getStock = function(){
            $scope.loading = true;

            // try to get the stock from our list
            $scope.stock = $scope.$parent.stocks.results.filter(function(s){
                return s.ticker == $state.params.ticker;
            })[0];
            if ($scope.stock){
                $scope.loading = false;
                $scope.drawChart();
            } else {
                // otherwise load up the stock from the API
                Stock.get($state.params.ticker)
                .success(function(data){
                    $scope.loading = false;
                    $scope.stock = data;
                    $scope.drawChart();
                });
            }
        }
        
        // draws tradingview chart
        $scope.drawChart = function(){
            new TradingView.widget({
                "autosize": true,
                "symbol": "TSX:" + $scope.stock.ticker,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "Dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "rgb(19,23,35)",
                "enable_publishing": false,
                "save_image": false,
                // "details": true,
                "hideideas": true,
                "container_id": "tradingview-widget"
            });
        }
        
        // ACTIONS
        // /////////////////////
        
        // UTILS
        // /////////////////////

        
        // WATCHERS
        ///////////////////////////////

        // INIT
        ///////////////////////////////
        $scope.getStock();
    }
]);


// chartsControllers.controller('stockOldCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$q', '$http', 'Stock',
//     function($rootScope, $scope, $state, $timeout, $q, $http, Stock) {
// 
//         // PARAMS
//         ///////////////////////////////
//         $scope.state = $state;
//         $scope.timespans = ["1d", "5d", "2w", "3m", "1y", "max"];
//         $scope.chartPromise; // inits promise used in querying for chart
// 
//         // METHODS
//         ///////////////////////////////
// 
//         // load up the stock if we don't have it already
//         $scope.getStock = function(){
//             $scope.loading = true;
//             Stock.get($state.params.ticker)
//             .success(function(data){
//                 $scope.loading = false;
//                 $scope.stock = data;
//                 $scope.getChart();
//             });
//         }
// 
//         // gets chart data based on current params
//         $scope.getChart = function(timespan){
//             // if there is an existing promise, cancel it
//             if ($scope.chartCanceller){
//                 $scope.chartCanceller.resolve();
//                 $scope.chartCanceller = undefined;
//             }
// 
//             // create (maybe slow) request for the new chart
//             $scope.chartCanceller = $q.defer();
//             $scope.loadingChart = true;
//             $scope.chartError = false;
//             var params = {
//                 'timespan': timespan || $state.params.timespan || '1d'
//             }
//             $http({
//                 url: '/api/stocks/stocks/'+$state.params.ticker+'/chart/'+toQueryString(params),
//                 timeout: $scope.chartCanceller.promise
//             })
//             .success(function(data, status, headers, config) {
//                 $scope.loadingChart = false;
//                 $scope.chartData = data;
//                 $scope.drawChart();
//             })
//             .error(function(data, status, headers, config) {
//                 // -1 status means cancelled
//                 if (status!==-1){
//                     $scope.loadingChart = false;
//                     $scope.chartError = true;
//                 }
//             });
//         }
// 
//         // draws chart based on data
//         $scope.drawChart = function(){
//             // destroy old chart
//             if ($scope.chart){
//                 $scope.chart.destroy();
//             }
// 
//             // grab element we're charting onto
//             var ctx = document.getElementById("chart-canvas").getContext("2d");
// 
//             // get util colors
//             var gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
//             gradientFill.addColorStop(0, "rgba(0,0,0,0.25)");
//             gradientFill.addColorStop(1, "transparent");
// 
//             // get data we're mapping
//             $scope.labels = $scope.chartData.map(d => d.timestamp);
//             $scope.close = $scope.chartData.map(d => d.close);
// 
//             // create chartjs config
//             var config = {
//                 type: 'line',
//                 data: {
//                     labels: $scope.labels,
//                     datasets: [
//                         {
//                             label: "Share Price",
//                             fill: true,
//                             backgroundColor: gradientFill,
//                             borderColor: '#3498db',
//                             borderWidth: 2,
//                             data: $scope.close,
//                             pointRadius: 0,
//                             pointHitRadius: 2,
//                             pointHoverRadius: 2,
//                             lineTension: 0.1,
//                         },
//                     ]
//                 },
//                 options: {
//                     responsive: true,
//                     legend: {
//                         display: false
//                     },
//                     title: {
//                         display: false
//                     },
//                     tooltips: {
//                         mode: 'index',
//                         intersect: false,
//                     },
//                     hover: {
//                         mode: 'index',
//                         intersect: false
//                     },
//                     scales: {
//                         xAxes: [{
//                             type: 'time',
//                             distribution: 'series',
//                             time: {
//                                 displayFormats: {
//                                     minute: 'k:mm',
//                                     hour: 'D MMM k:mm',
//                                     day: 'D MMM',
//                                     quarter: 'MMM YYYY'
//                                 },
//                             },
//                             gridLines: {
//                                 drawOnChartArea: false,
//                                 color: 'transparent',
//                             },
//                             ticks: {
//                                 fontColor: 'rgba(255,255,255,0.25)',
//                                 fontSize: '10',
//                                 fontStyle: 'bold',
//                                 maxRotation: 0,
//                                 minRotation: 0,
//                                 autoSkip: true,
//                                 autoSkipPadding: 20,
//                                 // source: 'labels',
//                             }
//                         }],
//                         yAxes: [{
//                             gridLines: {
//                                 color: 'rgba(255,255,255, 0.03)',
//                                 tickMarkLength: 5
//                             },
//                             ticks: {
//                                 fontColor: 'rgba(255,255,255,0.25)',
//                                 fontSize: '12',
//                                 fontStyle: 'bold',
//                             }
//                         }]
//                     },
//                     elements: {
//                         point: {
//                             radius: 0,
//                             hitRadius: 2
//                         }
//                     }
//                 }
//             };
//             $scope.chart = new Chart(ctx, config);
//         }
// 
// 
//         // ACTIONS
//         // /////////////////////
// 
//         $scope.setTimespan = function(timespan){
//             var params = angular.copy($state.params);
//             params['timespan'] = (timespan=="1d") ? undefined : timespan;
//             if (params['timespan'] !== $state.params.timespan){
//                 $state.go($state.current.name, params, {'notify': false});
//                 $scope.getChart(timespan);
//             }
//         }
// 
//         // user toggles a ticker as favorite or not
//         $scope.setFavorite = $rootScope.setFavorite;
// 
//         // UTILS
//         // /////////////////////
//         $scope.isFavorite = $rootScope.isFavorite;
// 
//         // capitalizes first character of string
//         $scope.caps = function(string){
//             return string.charAt(0).toUpperCase() + string.slice(1);
//         }
// 
//         // WATCHERS
//         ///////////////////////////////
// 
//         // INIT
//         ///////////////////////////////
//         $scope.getStock();
//     }
// ]);
