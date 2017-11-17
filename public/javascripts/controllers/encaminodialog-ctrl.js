angular.module('RDash')
.controller('EnCaminoDialogCtrl', ['$state', '$scope', 'encamino', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  EnCaminoDialogCtrl]);


function EnCaminoDialogCtrl($state, $scope, encamino, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("en camino dialog ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };

	$scope.encamino = encamino.data.data;
	console.log($scope.encamino);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.encamino});
}