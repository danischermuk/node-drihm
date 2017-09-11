angular.module('RDash')
.controller('DashCtrl', ['$state', 'buildings', 'appliances', '$scope', '$location','$mdSidenav', '$timeout', 'userService', 'buildingService', 'applianceService', 'socket', '$mdDialog', '$stateParams',  DashCtrl]);


function DashCtrl($state, buildings, appliances, $scope,  $location, $mdSidenav, $timeout, userService, buildingService, applianceService, socket,  $mdDialog, $stateParams) {
	console.log("dash ctrl open");
	
	
	$scope.current.buildings = buildings.data;
	$scope.appliances = appliances.data;
	$scope.toolbar.title = "DashBoard";

	$scope.appSwitch = function(appliance) {
  		applianceService.switchAppliance(appliance)
		.then(function (response) {
			console.log(response);
		}, function (error) {
			console.log(error);
		});
  	};

  	// Anaiza los cambios para mostrarlos en la pantalla
	socket.on('appliance-switch', function(data) {  
		console.log('App Switch');
    	console.log(data);

    	var applianceUpdateObject = angular.fromJson(data);
        var i;
          for(i=0;i<$scope.appliances.length;++i) {
              var appliance = $scope.appliances[i];
              if ( appliance._id === applianceUpdateObject._id) {
                  appliance.state = applianceUpdateObject.state;
                  break;
              }
          }
  	});




}