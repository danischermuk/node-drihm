angular.module('RDash')
	.controller('StockCtrl', ['$state', '$scope', 'products', '$location', '$mdSidenav', '$timeout', 'userService', 'sqlService', 'socket', '$mdDialog', '$stateParams', 'NgTableParams', StockCtrl]);


function StockCtrl($state, $scope, products, $location, $mdSidenav, $timeout, userService, sqlService, socket, $mdDialog, $stateParams, NgTableParams) {
	console.log("stock ctrl open");

	var initialParams = {
		count: 50 // initial page size
	};

	$scope.products = products.data.data;
	console.log($scope.products);
	$scope.tableParams = new NgTableParams(initialParams, { dataset: $scope.products });

	$scope.toolbar.title = "Stock";
	$scope.doQuery = function () {
		sqlService.queryProductsStock().then(function (response) {
			console.log(response.data.data);

			$scope.products = response.data.data;
			$scope.tableParams.reload();
		}, function (error) {
			console.log(error);
		});
	};

	$scope.openEnCamino = function (articulo, ev) {
		$mdDialog.show({
			controller: EnCaminoDialogCtrl,
			templateUrl: 'templates/dialogs/pendientes-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			resolve: {
				encamino: ['sqlService',
					function (sqlService) { return sqlService.queryProductEnCamino(articulo.Regis_Arti); }]
			},
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
	};


	$scope.openDetallesArticulo = function (articulo, ev) {
		$mdDialog.show({
			controller: ArticuloDialogCtrl,
			templateUrl: 'templates/dialogs/articulo-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			resolve: {
				encamino: ['sqlService',
					function (sqlService) { return sqlService.queryProductEnCamino(articulo.Regis_Arti); }],
				movimiento: ['sqlService',
					function (sqlService) { return sqlService.queryProductInventarioVentas(articulo.Regis_Arti,{}); }],
				detalle: [
					function() {
						var detalle={}; 
						detalle.codInterno 	= articulo.CodInternoArti;
						detalle.descripcion = articulo.DescripcionArti;
						detalle.nivel1 		= articulo.DescrNivelInt1;
						detalle.nivel2 		= articulo.DescrNivelInt2;
						detalle.nivel3 		= articulo.DescrNivelInt3;
						detalle.nivel4 		= articulo.DescrNivelInt4;
						detalle.nivel5 		= articulo.DescrNivelInt5;
						detalle.costo 		= articulo.PrCto1Mda1_Arti; 
						detalle.fecha		= articulo.FechaCosteo_Arti;
						detalle.Regis_Arti 	= articulo.Regis_Arti;
						detalle.pendientes	= articulo.StPedido1_StPendi;
						detalle.stock 		= articulo.Stock1_StkArti;
						detalle.encamino	= articulo.pendiente;
						console.log(detalle); 
						return detalle;}]
			},
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
	};

}