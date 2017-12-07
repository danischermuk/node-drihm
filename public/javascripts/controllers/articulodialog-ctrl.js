angular.module('RDash')
.controller('ArticuloDialogCtrl', ['$state', '$scope', 'encamino', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  ArticuloDialogCtrl]);


function ArticuloDialogCtrl($state, $scope, encamino, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("articulo dialog ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.encamino = encamino.data.data;
	console.log($scope.encamino);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.encamino});
}