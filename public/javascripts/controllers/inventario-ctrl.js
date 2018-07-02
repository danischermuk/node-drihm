

angular.module('RDash')
	.controller('InventarioCtrl', ['$state', '$scope', 'products', '$location', '$mdSidenav', '$timeout', 'userService', 'sqlService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams', InventarioCtrl]);


function InventarioCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket, $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");

	var initialParams = {
		count: 100 // initial page size
	};

	$scope.parametrosBusqueda = {};
	$scope.desdeFecha;
	$scope.hastaFecha;


	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products });

	$scope.toolbar.title = "Movimiento";
	$scope.doQuery = function () {
		$scope.parametrosBusqueda.desdeFecha = "\'" + $scope.desdeFecha.getFullYear() + "-" +
			($scope.desdeFecha.getMonth() + 1) + "-" +
			$scope.desdeFecha.getDate() + "\'";
		$scope.parametrosBusqueda.hastaFecha = "\'" + $scope.hastaFecha.getFullYear() + "-" +
			($scope.hastaFecha.getMonth() + 1) + "-" +
			$scope.hastaFecha.getDate() + "\'";
		sqlService.queryProductsInventarioVentas($scope.parametrosBusqueda).then(function (response) {
			console.log(response.data.data);
			$scope.tableParams = new NgTableParams(initialParams, { dataset: response.data.data });
		}, function (error) {
			console.log(error);
		});
	};

	$scope.sumProduct = function (items, prop1, prop2) {
		return items.reduce(function (a, b) {
		  return a + (b[prop1] * b[prop2]);
		}, 0);
	  };
	
	  $scope.sum = function (items, prop1) {
		return items.reduce(function (a, b) {
		  return a + b[prop1];
		}, 0);
	  };
	  
	  $scope.sumPos = function (items, prop1) {
		return items.reduce(function (a, b) {
		  return a + (b[prop1] >= 0? b[prop1]:0);
		}, 0);
	  };
	  $scope.sumNeg = function (items, prop1) {
		return items.reduce(function (a, b) {
		  return a + (b[prop1] <= 0? (b[prop1]*(-1)):0);
		}, 0);
	  };

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.products.length);
	};


}