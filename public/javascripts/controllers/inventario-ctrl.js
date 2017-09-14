angular.module('RDash')
.controller('InventarioCtrl', ['$state', '$scope', 'products', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  InventarioCtrl]);


function InventarioCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.parametrosBusqueda = {};
	$scope.parametrosBusqueda.desdeFecha;
	$scope.parametrosBusqueda.hastaFecha;

	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});

	$scope.toolbar.title = "Inventario";
	$scope.doQuery = function () {
		sqlService.queryProductsInventarioVentas($scope.parametrosBusqueda).then(function (response) {
			console.log(response.data.data);
			$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});
		}, function (error) {
			console.log(error);
		});
	};

}