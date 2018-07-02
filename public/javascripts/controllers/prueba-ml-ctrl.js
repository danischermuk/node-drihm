angular.module('RDash')
.controller('PruebaMLCtrl', ['$state', '$scope', '$location','$mdSidenav', '$timeout', '$http', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  PruebaMLCtrl]);


function PruebaMLCtrl($state, $scope, $location, $mdSidenav, $timeout, $http, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("pruebaML ctrl open");


	var initialParams = {
		count: 100, // initial page size
		sorting: {fecha_movartid: "asc"}
	};

	$scope.query = {};
	$scope.query.query = "";
    $scope.toolbar.title = "PRUEBA ML - NO TOCAR!!!!!!!!!!!!!";
    $scope.queryURL = "https://api.mercadolibre.com/sites/MLA/search?nickname=";
    $scope.accesToken = "&access_token=APP_USR-7280984037562347-060611-4bda104e580b8e7e87b37684e40d6dc0-47531210";
    $scope.qresponse = {};
    $scope.seller ={};
    $scope.seller.test = 0;
	$scope.doQuery = function () {
        $scope.getListings(0, 50);
        $scope.seller.test +=1;
	};


    $scope.getListings =  function (offset, limit) {
        var queryURL = $scope.queryURL + $scope.query.query + "&limit=" + limit + "&offset=" + offset + $scope.accesToken;
        console.log(queryURL);
		$http.get(queryURL).then(function(data) {
            $scope.data = data.data;
            $scope.seller.cantPublicaciones = $scope.data.paging.total;
            $scope.seller.paginas = Math.floor($scope.seller.cantPublicaciones / 50);
            $scope.seller.test *=2;

          })
          .catch(function(data, status) {
            console.error('error', response.status, response.data);
          })
          .finally(function() {
            console.log($scope.seller);
          });;
    };

}