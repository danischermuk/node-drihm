angular.module('RDash')
.controller('ArticuloDialogCtrl', ['$state', '$scope', 'encamino', 'movimiento', 'detalle', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  ArticuloDialogCtrl]);


function ArticuloDialogCtrl($state, $scope, encamino, movimiento, detalle, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("articulo dialog ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.encamino = encamino.data.data;
	$scope.movimiento = movimiento.data.data;
	$scope.detalle = detalle;
	console.log($scope.encamino);
	console.log($scope.movimiento);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.encamino});
	$scope.tableParams2 = new NgTableParams(initialParams, { dataset: $scope.movimiento});

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
}