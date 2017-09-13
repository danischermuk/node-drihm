'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsStock(); }]
                },

                controller: 'DashCtrl'
            })
            .state('stock', {
                url: '/stock',
                templateUrl: 'templates/stock.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsStock(); }]
                },

                controller: 'StockCtrl'
            });
    }
]);