var app = angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngMaterial', 'ngMessages', 'btford.socket-io']);

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.factory('userService', ['$http', function($http) {

    var urlBase = '/api/user';
    var userService = {};

    userService.getUsers = function () {
        return $http.get(urlBase);
    };

    userService.getMe = function () {
        return $http.get(urlBase + '/me');
    };


    userService.getUser = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    userService.insertUser = function (cust) {
        return $http.post(urlBase, cust);
    };

    userService.updateUser = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    userService.deleteUser = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    userService.getUserMenu = function (id) {
        return $http.get(urlBase + '/' + id + '/menu');
    };


    
    return userService;
}]);

app.factory('buildingService', ['$http', function($http) {

    var urlBase = '/api/b';
    var buildingService = {};

    buildingService.getBuildings = function () {
        return $http.get(urlBase);
    };

    buildingService.getBuilding = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    buildingService.getBuildingsByUser = function (id) {
        return $http.get(urlBase + '/user/' + id);
    };

    buildingService.insertBuilding = function (cust) {
        return $http.post(urlBase, cust);
    };

    buildingService.updateBuilding = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    buildingService.deleteBuilding = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    buildingService.getBuildingRoom = function (buildingId, roomId) {
        return $http.get(urlBase + '/' + buildingId + '/r/' + roomId);
    };

    buildingService.insertBuildingRoom = function (id, room) {
        return $http.post(urlBase + '/' + id + '/r', room);
    };
    return buildingService;
}]);

app.factory('applianceService', ['$http', function($http) {

    var urlBase = '/api/appliance';
    var applianceService = {};

    applianceService.getAppliances = function () {
        return $http.get(urlBase);
    };

    // buildingService.getBuilding = function (id) {
    //     return $http.get(urlBase + '/' + id);
    // };

    // buildingService.getBuildingsByUser = function (id) {
    //     return $http.get(urlBase + '/user/' + id);
    // };

    // buildingService.insertBuilding = function (cust) {
    //     return $http.post(urlBase, cust);
    // };

    // buildingService.updateBuilding = function (cust) {
    //     return $http.put(urlBase + '/' + cust.ID, cust)
    // };

    // buildingService.deleteBuilding = function (id) {
    //     return $http.delete(urlBase + '/' + id);
    // };

    // buildingService.getBuildingRoom = function (buildingId, roomId) {
    //     return $http.get(urlBase + '/' + buildingId + '/r/' + roomId);
    // };

    // buildingService.insertBuildingRoom = function (id, room) {
    //     return $http.post(urlBase + '/' + id + '/r', room);
    // };

    applianceService.switchAppliance = function(cust) {
        console.log("SwithAppliance Service");
        console.log(cust);
        return $http.post(urlBase + '/switch', cust);
    }

    return applianceService;
}]);


app.factory('agendaService', ['$http', function($http) {

    var urlBase = '/api/agenda';
    var agendaService = {};

    agendaService.getJobs = function () {
        return $http.get(urlBase);
    };

    // buildingService.getBuilding = function (id) {
    //     return $http.get(urlBase + '/' + id);
    // };

    // buildingService.getBuildingsByUser = function (id) {
    //     return $http.get(urlBase + '/user/' + id);
    // };

    // buildingService.insertBuilding = function (cust) {
    //     return $http.post(urlBase, cust);
    // };

    // buildingService.updateBuilding = function (cust) {
    //     return $http.put(urlBase + '/' + cust.ID, cust)
    // };

    // buildingService.deleteBuilding = function (id) {
    //     return $http.delete(urlBase + '/' + id);
    // };

    // buildingService.getBuildingRoom = function (buildingId, roomId) {
    //     return $http.get(urlBase + '/' + buildingId + '/r/' + roomId);
    // };

    // buildingService.insertBuildingRoom = function (id, room) {
    //     return $http.post(urlBase + '/' + id + '/r', room);
    // };

    return agendaService;
}]);