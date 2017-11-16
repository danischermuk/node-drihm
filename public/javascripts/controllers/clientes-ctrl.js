angular.module('RDash')
.controller('ClientesCtrl', ['$state', '$scope', 'clientes', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  ClientesCtrl]);


function ClientesCtrl($state, $scope, clientes, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("clientes ctrl open");
	
	var initialParams = {
        count: 100 // initial page size
    };

	$scope.clientes = clientes.data.data;
	console.log($scope.clientes);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.clientes});

	$scope.toolbar.title = "Clientes";
	$scope.doQuery = function () {
		sqlService.queryClientes().then(function (response) {
			console.log(response.data.data);
			
			$scope.clientes = response.data.data;
			$scope.tableParams.reload();
		}, function (error) {
			console.log(error);
		});
	};

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.clientes.length);
	};

}