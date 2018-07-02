angular.module('RDash')
.controller('ClienteCtrl', ['$state', '$scope', 'cliente', 'transacciones', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  ClienteCtrl]);


function ClienteCtrl($state, $scope, cliente, transacciones, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("cliente ctrl open");
	
	var initialParams = {
        count: 100 // initial page size
    };
	$scope.cliente = cliente.data.data[0];
	$scope.transacciones = transacciones.data.data;

	console.log($scope.cliente);
	console.log($scope.transacciones);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.transacciones});

	$scope.toolbar.title = "Cliente - " + cliente.data.data[0].RazonSocialCli;

	$scope.dateFilterDef = {};
	$scope.changeCount = function () {
		$scope.tableParams.count($scope.cliente.length);
	};

	$scope.changeCount = function () {
		$scope.tableParams.count($scope.transacciones.length);
	};

	$scope.$watch(function () { return $scope.dateFilterDef.start; }, function (newValue, oldValue) {
		$scope.applyFilter();
	});

	$scope.$watch(function () { return $scope.dateFilterDef.end; }, function (newValue, oldValue) {
		$scope.applyFilter();
	});
	
	$scope.applyFilter = function () {
		var start = $scope.dateFilterDef.start == null ? Number.MIN_VALUE : $scope.dateFilterDef.start;
		var end = $scope.dateFilterDef.end == null ? Number.MAX_VALUE : $scope.dateFilterDef.end;
		var result = [];
		
		for (var i=0; i<$scope.transacciones.length; i++){
			var fecha = new Date($scope.transacciones[i].Fecha_CliTra);
            if (start <= fecha && end >= fecha)  {
                result.push($scope.transacciones[i]);
            }
        }    
		$scope.tableParams = new NgTableParams({}, {initialParams, dataset: result });
		$scope.changeCount();
	};

	$scope.openDetallesComprobante = function (comprobante, ev) {
		$mdDialog.show({
			controller: ComprobanteDialogCtrl,
			templateUrl: 'templates/dialogs/comprobante-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			resolve: {
				comprobante: ['sqlService',
					function (sqlService) { return sqlService.queryTransaction(comprobante.NroComprob_CliTra); }]
			},
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
	};

}