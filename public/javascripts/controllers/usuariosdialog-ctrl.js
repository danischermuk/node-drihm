angular.module('RDash')
.controller('UsuariosDialogCtrl', ['$state', '$scope', 'usuario', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  UsuariosDialogCtrl]);


function UsuariosDialogCtrl($state, $scope, usuario, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("usuario ctrl open");
	
	$scope.usuario = usuario;
	
	$scope.saveUsuario = function (usuario) {
		

	};

}