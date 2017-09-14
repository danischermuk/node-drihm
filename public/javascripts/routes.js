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
            })
            .state('precios', {
                url: '/precios',
                templateUrl: 'templates/precios.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsPrices(); }]
                },

                controller: 'PreciosCtrl'
            })
            .state('inventario', {
                url: '/inventario',
                templateUrl: 'templates/inventario.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsPrices(); }]
                },

                controller: 'InventarioCtrl'
            })
            .state('prueba', {
                url: '/prueba',
                templateUrl: 'templates/prueba.html',
                controller: 'PruebaCtrl'
            });
    }
]);