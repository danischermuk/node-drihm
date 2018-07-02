angular.module('RDash')
	.controller('ComprobanteDialogCtrl', ['$state', '$scope', 'comprobante', '$location', '$mdSidenav', '$timeout', 'userService', 'sqlService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams', ComprobanteDialogCtrl]);


function ComprobanteDialogCtrl($state, $scope, comprobante, $location, $mdSidenav, $timeout, userService, sqlService, socket, $mdDialog, $stateParams, NgTableParams) {
	console.log("comprobante dialog ctrl open");

	$scope.comprobante = comprobante.data.data[0];
	var initialParams = {
		count: $scope.comprobante.items.length // initial page size
	};

	
	console.log($scope.comprobante);
	console.log($scope.comprobante.items);
	$scope.tableParams = new NgTableParams(initialParams, {counts:[], dataset: $scope.comprobante.items });

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
			return a + (b[prop1] >= 0 ? b[prop1] : 0);
		}, 0);
	};

	$scope.sumNeg = function (items, prop1) {
		return items.reduce(function (a, b) {
			return a + (b[prop1] <= 0 ? (b[prop1] * (-1)) : 0);
		}, 0);
	};
	
}