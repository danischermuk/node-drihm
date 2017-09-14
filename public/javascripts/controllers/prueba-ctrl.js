angular.module('RDash')
.controller('PruebaCtrl', ['$state', '$scope', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  PruebaCtrl]);


function PruebaCtrl($state, $scope, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");

	$scope.query = {};
	$scope.query.query = "";
	$scope.toolbar.title = "PRUEBA - NO TOCAR!!!!!!!!!!!!!";
	$scope.doQuery = function () {
		console.log($scope.query);
		sqlService.doQuery($scope.query).then(function (response) {
			console.log(response.data.data);
		}, function (error) {
			console.log(error);
		});
	};

}