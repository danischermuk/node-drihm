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
		data.query = 'SELECT dbo.Articulo.Regis_Arti, dbo.Articulo.CodInternoArti, dbo.Articulo.DescripcionArti, dbo.ArticuloStock.Stock1_StkArti, Regis_NivelInt1, Regis_NivelInt2, Regis_NivelInt3, Regis_NivelInt4, Regis_NivelInt5 '
		+ 'FROM dbo.Articulo '
		+ 'LEFT JOIN dbo.ArticuloStock ON dbo.Articulo.Regis_arti=dbo.ArticuloStock.Regis_Arti '
		//+ 'WHERE dbo.Articulo.Regis_Arti BETWEEN 1470 AND 1500 '
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