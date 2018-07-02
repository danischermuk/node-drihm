angular.module('RDash')
.controller('PruebaCtrl', ['$state', '$scope', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  PruebaCtrl]);


function PruebaCtrl($state, $scope, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("prueba ctrl open");


	var initialParams = {
		count: 100, // initial page size
		sorting: {fecha_movartid: "asc"}
	};

	$scope.query = {};
	$scope.query.query = "";
	$scope.toolbar.title = "PRUEBA - NO TOCAR!!!!!!!!!!!!!";
	$scope.qresponse = {};
	$scope.doQuery = function () {
		console.log($scope.query);
		sqlService.doQuery($scope.query).then(function (response) {
			console.log(response.data.data);
			$scope.qresponse = response.data.data;
			$scope.CreateTableFromJSON($scope.qresponse);
			$scope.tableParams = new NgTableParams(initialParams, { dataset: response.data.data });
		}, function (error) {
			console.log(error);
		});
	};


	$scope.CreateTableFromJSON = function(myBooks) {
        

        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }

}