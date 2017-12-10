
var chartsControllers = angular.module('chartsControllers', []);
chartsControllers.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'Exchange', 'Stock', 'Tag',
    function($rootScope, $scope, $state, Exchange, Stock, Tag) {

        // PARAMS
        ///////////////////////////////
        $scope.exchanges = {loading: false, results: [], current: []};
        $scope.tags = {loading: false, results: [], current: []};
        $scope.stocks = {loading: false, results: [], current: []}

        // METHODS
        ///////////////////////////////
        
        $scope.initializePage = function(){
            $scope.getExchanges(function(){
                console.log("exchanges")
            });
            $scope.getTags(function(){
                console.log("tags")
            });
        }
        
        // assembles the initial set of exchanges for this sector
        $scope.getExchanges = function(callback){
            $scope.exchanges.loading = true;
            Exchange.filter({})
            .success(function(data){
                $scope.exchanges.loading = false;
                $scope.exchanges.results = data.results;
                
                // determine which ones are current based off of query params
                // if ($state.params.exchanges){
                //     $state.params.exchanges.split(",").forEach(function(e){
                // 
                //     });
                // }
                // console.log($state.params.exchanges)
                
                if (callback){
                    return callback();
                }
            })
        }
        
        // assembles the initial set of tags for this sector
        $scope.getTags = function(callback){
            $scope.tags.loading = true;
            Tag.filter({})
            .success(function(data){
                $scope.tags.loading = false;
                $scope.tags.results = data.results;

                if (callback){
                    return callback();
                }
            })
        }
        
        // gets list of stocks based on filter params
        $scope.filterStocks = function(){
            $scope.stocks.loading = true;
            Stock.filter({})
            .success(function(data){
                $scope.stocks.loading = false;
                $scope.stocks.results = data.results;

                if (callback){
                    return callback();
                }
            })
        }
        
        // ACTIONS
        ///////////////////////////////
        
        // user toggles exchange on or off
        $scope.currentExchangeChanged = function(exchange){
            // remove from current list of exchanges
            $scope.exchanges.current = $scope.exchanges.current.filter(function(e){
                return e !== exchange.symbol;
            });
            
            // put into list of current if need be
            if (exchange.current){
                $scope.exchanges.current.push(exchange.symbol);
            }
        }
        
        // user toggles tag on or off
        $scope.currentTagChanged = function(tag){
            // remove from current list of tabs
            $scope.tags.current = $scope.tags.current.filter(function(t){
                return t !== tag.id;
            });
            
            // put into list of current if need be
            if (tag.current){
                $scope.tags.current.push(tag.id);
            }
        }
        
        // WATCHERS
        ///////////////////////////////

        // INIT
        ///////////////////////////////
        $scope.initializePage();
    }
]);
