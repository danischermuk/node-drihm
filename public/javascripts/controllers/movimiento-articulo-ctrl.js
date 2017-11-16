

angular.module('RDash')
	.controller('MovimientoArticuloCtrl', ['$state', '$scope', 'movimiento', '$location', '$mdSidenav', '$timeout', 'userService', 'sqlService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams', MovimientoArticuloCtrl]);


function MovimientoArticuloCtrl($state, $scope, movimiento, $location, $mdSidenav, $timeout, userService, sqlService, socket, $mdDialog, $stateParams, NgTableParams) {
	console.log("MovimientoArticuloCtrl open");

	var initialParams = {
		count: 100, // initial page size
		sorting: {fecha_movartid: "asc"}
	};
	$scope.toolbar.title = "Movimiento Detallado: " + movimiento.data.data[0].codinternoarti;
	$scope.parametrosBusqueda = {};
	$scope.desdeFecha;
	$scope.hastaFecha;
	$scope.movimiento = movimiento.data.data;
	console.log($scope.movimiento);

	$scope.tableParams = new NgTableParams(initialParams, { dataset: movimiento.data.data });


	$scope.doQuery = function () {
		$scope.parametrosBusqueda.desdeFecha = "\'" + $scope.desdeFecha.getFullYear() + "-" +
			($scope.desdeFecha.getMonth() + 1) + "-" +
			$scope.desdeFecha.getDate() + "\'";
		$scope.parametrosBusqueda.hastaFecha = "\'" + $scope.hastaFecha.getFullYear() + "-" +
			($scope.hastaFecha.getMonth() + 1) + "-" +
			$scope.hastaFecha.getDate() + "\'";
		sqlService.queryProductInventarioVentas($stateParams.product_id, $scope.parametrosBusqueda).then(function (response) {
			console.log(response.data.data);
			$scope.movimiento = response.data.data;
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
		$scope.tableParams.count($scope.movimiento.length);
	};

}