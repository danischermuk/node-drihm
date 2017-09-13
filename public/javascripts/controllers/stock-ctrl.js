angular.module('RDash')
.controller('StockCtrl', ['$state', '$scope', 'products', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  StockCtrl]);


function StockCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products});

	$scope.toolbar.title = "DashBoard";
	$scope.doQuery = function () {
		sqlService.queryProductsStock().then(function (response) {
			console.log(response.data.data);
			
			$scope.products = response.data.data;
			$scope.tableParams.reload();
		}, function (error) {
			console.log(error);
		});
	};

}