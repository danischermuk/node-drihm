angular.module('RDash')
	.controller('MovimientoArticuloCtrl', ['$state', '$scope', 'movimiento', '$location', '$mdSidenav', '$timeout', 'userService', 'sqlService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams', '$filter', MovimientoArticuloCtrl]);


function MovimientoArticuloCtrl($state, $scope, movimiento, $location, $mdSidenav, $timeout, userService, sqlService, socket, $mdDialog, $stateParams, NgTableParams, $filter) {
	console.log("MovimientoArticuloCtrl open");

	var initialParams = {
		count: 100, // initial page size
		sorting: { fecha_movartid: "desc" }
	};
	$scope.toolbar.title = "Movimiento Detallado: " + movimiento.data.data[0].codinternoarti;
	$scope.dateFilterDef = {};
	$scope.movimiento = movimiento.data.data;
	console.log($scope.movimiento);

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.movimiento.length);
	};

	$scope.$watch(function () { return $scope.dateFilterDef.start; }, function (newValue, oldValue) {
		$scope.applyFilter();
	});

	$scope.$watch(function () { return $scope.dateFilterDef.end; }, function (newValue, oldValue) {
		$scope.applyFilter();
	});
	
	$scope.applyFilter = function () {
		var start = $scope.dateFilterDef.start == null ? Number.MIN_VALUE : $scope.dateFilterDef.start;
		var end = $scope.dateFilterDef.end == null ? Number.MAX_VALUE : $scope.dateFilterDef.end;
		var result = [];
		
		for (var i=0; i<$scope.movimiento.length; i++){
			var fecha = new Date($scope.movimiento[i].fecha_movartid);
            if (start <= fecha && end >= fecha)  {
                result.push($scope.movimiento[i]);
            }
        }    
		$scope.tableParams = new NgTableParams({}, {initialParams, dataset: result });
		$scope.changeCount();
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

	$scope.applyFilter();
}