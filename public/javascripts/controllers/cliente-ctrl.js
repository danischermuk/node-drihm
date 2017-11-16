angular.module('RDash')
.controller('ClienteCtrl', ['$state', '$scope', 'cliente', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  ClienteCtrl]);


function ClienteCtrl($state, $scope, cliente, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("cliente ctrl open");
	
	var initialParams = {
        count: 100 // initial page size
    };
	$scope.cliente = cliente.data.data[0];
	console.log($scope.cliente);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.cliente});

	$scope.toolbar.title = "Cliente - " + cliente.data.data[0].RazonSocialCli;
	$scope.doQuery = function () {
		sqlService.queryCliente().then(function (response) {
			console.log(response.data.data);
			
			$scope.cliente = response.data.data[0];
			$scope.tableParams.reload();
		}, function (error) {
			console.log(error);
		});
	};

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.cliente.length);
	};

}