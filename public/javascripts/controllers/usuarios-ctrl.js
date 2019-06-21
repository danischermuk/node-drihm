angular.module('RDash')
.controller('UsuariosCtrl', ['$state', '$scope', 'usuarios', '$location','$mdSidenav', '$timeout', 'userService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams',  UsuariosCtrl]);


function UsuariosCtrl($state, $scope, usuarios, $location, $mdSidenav, $timeout, userService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("usuarios ctrl open");
	
	var initialParams = {
        count: 100 // initial page size
    };

	$scope.usuarios = usuarios.data;
	console.log($scope.usuarios);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.usuarios});

	$scope.toolbar.title = "Usuarios";
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

	$scope.openUsuario = function (usuario, ev) {
		console.log(usuario);
		$mdDialog.show({
			controller: UsuariosDialogCtrl,
			templateUrl: 'templates/dialogs/usuarios-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			resolve: {
				usuario: [
					function() {return usuario;}]
			},
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
	};

}