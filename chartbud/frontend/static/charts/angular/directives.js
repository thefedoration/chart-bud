
var chartsDirectives = angular.module('chartsDirectives', []);

// chartsDirectives.controller('headerController', ['$scope', '$state', '$rootScope',
//     function($scope, $state, $rootScope) {
//         // PARAMS
//         // /////////////////////
//         $scope.sidebarOpen = false;
// 
//         // ACTIONS
//         // /////////////////////
//         $scope.toggleSidebar = function(isOpen){
//             $scope.sidebarOpen = isOpen;
//         }
// 
//         // WATCHERS
//         // /////////////////////
// 
//         // close sidebar on state change
//         $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
//             $scope.sidebarOpen = false;
//         });
// 
//         // INIT
//         // /////////////////////
//     }
// ]).directive('header', function($rootScope) {
//     return {
//         restrict: 'E',
//         templateUrl: '/static/external/_main/html/directives/header.html' + '?v=' + Date.now().toString(),
//         controller: 'headerController'
//     }
// });
