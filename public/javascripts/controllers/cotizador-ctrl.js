angular.module('RDash')
.controller('CotizadorCtrl', ['$state', '$scope', 'products', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  CotizadorCtrl]);


function CotizadorCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("Cotizador ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});

	$scope.toolbar.title = "Cotizador";
	$scope.doQuery = function () {
		sqlService.queryProductsStock().then(function (response) {
			console.log(response.data.data);
			
			$scope.products = response.data.data;
			$scope.tableParams.reload();
		}, function (error) {
			console.log(error);
		});
	};

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.products.length);
	};

}