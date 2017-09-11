/**
 * Master Controller
 */

 angular.module('RDash')
 .controller('MasterCtrl', ['$scope', '$location','$mdSidenav', '$timeout', 'userService', 'buildingService', 'applianceService', '$mdDialog', '$state', 'socket', MasterCtrl]);


 function MasterCtrl($scope, $location, $mdSidenav, $timeout, userService, buildingService, applianceService, $mdDialog, $state, socket) { 
  console.log("master ctrl open");

  socket.emit('event', "eventooooo");
  socket.on('messages', function(data) {  
    console.log(data);
  });


  $scope.current       = {};

  $scope.hide = function() {
    console.log("hidden master");
    $mdDialog.hide();
  };
  
  $scope.answer = function(answer) {
    console.log(answer);
    $mdDialog.hide(answer);
  };


  $scope.go = function ( state ) {
   console.log(state);
   $state.go( state );
 };


 

 $scope.users         = {};
 $scope.currentUser   = {};
 $scope.userMenu      = {};
 $scope.currentRoom   = {};
 $scope.buildings = {};
 $scope.currentBuilding   = {};
 $scope.toolbar       = {};

 $scope.toolbar.title = "Toolbar";
 $scope.getUser = function () {
   userService.getMe()
   .then(function (response) {
    $scope.currentUser = response.data;
    console.log($scope.currentUser);
    userService.getUserMenu($scope.currentUser.username)
    .then( function (response) {
      $scope.userMenu = response.data;
    })
    buildingService.getBuildingsByUser($scope.currentUser._id)
    .then( function (response) {
      $scope.buildings = response.data;
      console.log(response.data);
    }, function (error) {
      $scope.status = 'Unable to find any buildings for this user' + error.message;
    })
  }, function (error) {
    $scope.status = 'Unable to load user: ' + error.message;
  });
 };
 $scope.getUser();

 $scope.showRoom = function (building, room) {
  $scope.currentRoom = room;
  $scope.toolbar.title = room.name;
  $state.go ('room', {buildingId: building._id, roomId: room._id});
};

$scope.showBuilding = function (building) {
  $scope.currentBuilding = building;
  $scope.current.building = building;
  $scope.toolbar.title = building.name;
  $state.go ('building', {buildingId: building._id});
};


	 /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
     $scope.debounce = function(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
        args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    };
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
     $scope.buildDelayedToggler=function (navID) {
      return $scope.debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID).toggle();
      }, 200);
    };
    
    

    $scope.toggleLeft = $scope.buildDelayedToggler('left');	
    $scope.closeLeft = function () {
      $mdSidenav('left').close();
    };

    $scope.dashboard = {  "name":   "Dashboard",
    "url":    "/#",
    "type":   "item",
    "iconUrl":  "/images/dash.svg",             
    };

    $scope.schedule = {  "name":   "Schedule",
    "url":    "/#",
    "type":   "item",
    "iconUrl":  "/images/alarm.svg",             
    };

  $scope.rooms =    {
    "name":   "Building1",
    "url":    "/#",
    "type":   "menu"
  };

  $scope.rooms.items =  [{  "name": "Room1",
  "url":  "/tables",
  "type": "item"
}, { 
  "name": "Room2",
  "url":  "/#",
  "type": "item"
},{  
  "name": "Room3",
  "url":  "/#",
  "type": "item"
} ];

$scope.settings = { "name":   "Settings",
"url":    "/settings",
"type":   "item",
"iconUrl":  "/images/settings.svg",             
};                  
}



