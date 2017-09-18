angular.module('RDash')
.controller('InventarioCtrl', ['$state', '$scope', 'products', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  InventarioCtrl]);


function InventarioCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.parametrosBusqueda = {};
	$scope.desdeFecha;
	$scope.hastaFecha;


	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});

	$scope.toolbar.title = "Inventario";
	$scope.doQuery = function () {
		$scope.parametrosBusqueda.desdeFecha="\'" +$scope.desdeFecha.getFullYear()+"-"+
		($scope.desdeFecha.getMonth()+1)+"-"+
		$scope.desdeFecha.getDate() +"\'";
		$scope.parametrosBusqueda.hastaFecha="\'" +$scope.hastaFecha.getFullYear()+"-"+
		($scope.hastaFecha.getMonth()+1)+"-"+
		$scope.hastaFecha.getDate()+ "\'";
		sqlService.queryProductsInventarioVentas($scope.parametrosBusqueda).then(function (response) {
			console.log(response.data.data);
			$scope.tableParams = new NgTableParams(initialParams, { dataset: response.data.data});
		}, function (error) {
			console.log(error);
		});
	};

}