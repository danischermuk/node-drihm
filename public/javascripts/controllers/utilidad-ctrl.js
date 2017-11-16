angular.module('RDash')
.controller('UtilidadCtrl', ['$state', '$scope', 'products', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  UtilidadCtrl]);


function UtilidadCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("utilidad ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});

	$scope.toolbar.title = "Utilidad";
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