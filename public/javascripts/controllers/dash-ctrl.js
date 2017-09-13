angular.module('RDash')
.controller('DashCtrl', ['$state', '$scope', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  DashCtrl]);


function DashCtrl($state, $scope,  $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("dash ctrl open");
	
	var initialParams = {
        count: 50 // initial page size
    };


	$scope.toolbar.title = "DashBoard";
	$scope.doQuery = function () {
		console.log("hago el SQL Query");
		var data = {};
		data.query = 'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, dbo.ArticuloNivelIntegra1.DescrNivelInt1, dbo.ArticuloNivelIntegra2.DescrNivelInt2, dbo.ArticuloNivelIntegra3.DescrNivelInt3, dbo.ArticuloNivelIntegra4.DescrNivelInt4, dbo.ArticuloNivelIntegra5.DescrNivelInt5 '
		+ 'FROM dbo.Articulo '
		+ 'LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra1 ON dbo.Articulo.Regis_NivelInt1=dbo.ArticuloNivelIntegra1.Regis_NivelInt1 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra2 ON dbo.Articulo.Regis_NivelInt2=dbo.ArticuloNivelIntegra2.Regis_NivelInt2 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra3 ON dbo.Articulo.Regis_NivelInt3=dbo.ArticuloNivelIntegra3.Regis_NivelInt3 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra4 ON dbo.Articulo.Regis_NivelInt4=dbo.ArticuloNivelIntegra4.Regis_NivelInt4 '
		+ 'LEFT JOIN dbo.ArticuloNivelIntegra5 ON dbo.Articulo.Regis_NivelInt5=dbo.ArticuloNivelIntegra5.Regis_NivelInt5 '
		//+ 'WHERE dbo.Articulo.Regis_Arti BETWEEN 2750 AND 2780 '
		+ 'ORDER BY CodInternoArti;';
		console.log("DATA.QUERY - ");
		console.log(data.query);
		
		sqlService.doQuery(data).then(function (response) {
			console.log(response.data);
			
			$scope.tableParams = new NgTableParams(initialParams, { dataset: response.data.data});
		}, function (error) {
			console.log(error);
		});
	};

}