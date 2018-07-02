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
                url: '/movimiento',
                templateUrl: 'templates/inventario.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsInventarioVentas({}); }]
                },

                controller: 'InventarioCtrl'
            })
            .state('movimiento-producto', {
                url: '/movimiento/:product_id',
                templateUrl: 'templates/movimiento-articulo.html',

                resolve: {
                    movimiento: ['$stateParams', 'sqlService',
                        function ($stateParams, sqlService) { return sqlService.queryProductInventarioVentas($stateParams.product_id, {}); }]
                },

                controller: 'MovimientoArticuloCtrl'
            })
            .state('utilidad', {
                url: '/utilidad',
                templateUrl: 'templates/utilidad.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsUtility(); }]
                },

                controller: 'UtilidadCtrl'
            })
            .state('cotizador', {
                url: '/cotizador',
                templateUrl: 'templates/cotizador.html',

                resolve: {
                    products: ['sqlService',
                        function (sqlService) { return sqlService.queryProductsUtility(); }]
                },

                controller: 'CotizadorCtrl'
            })
            .state('clientes', {
                url: '/clientes',
                templateUrl: 'templates/clientes.html',

                resolve: {
                    clientes: ['sqlService',
                        function (sqlService) { return sqlService.queryClientes(); }]
                },

                controller: 'ClientesCtrl'
            })
            .state('cliente', {
                url: '/cliente/:cliente_id',
                templateUrl: 'templates/cliente.html',

                resolve: {
                    cliente: ['$stateParams','sqlService',
                        function ($stateParams,sqlService) { return sqlService.queryCliente($stateParams.cliente_id); }],
                    transacciones: ['$stateParams','sqlService',
                        function ($stateParams,sqlService) { return sqlService.queryClienteTransactions($stateParams.cliente_id); }]
                },

                controller: 'ClienteCtrl'
            })
            .state('prueba', {
                url: '/prueba',
                templateUrl: 'templates/prueba.html',
                controller: 'PruebaCtrl'
            })
            .state('pruebaML', {
                url: '/prueba-ml',
                templateUrl: 'templates/prueba-ml.html',
                controller: 'PruebaMLCtrl'
            });
    }
]);