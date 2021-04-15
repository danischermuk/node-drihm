angular.module('RDash')
.controller('PendientesDialogCtrl', ['$state', '$scope', 'pendientes', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  PendientesDialogCtrl]);


function PendientesDialogCtrl($state, $scope, pendientes, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("pendientes dialog ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.pendientes = pendientes.data.data;
	console.log($scope.pendientes);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.pendientes});
}