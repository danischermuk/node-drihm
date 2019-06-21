var app = angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngMaterial', 'ngMessages', 'btford.socket-io', 'ngTable']);

angular.module('RDash').config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format('DD/MM/YYYY') : '';
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
});
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

app.factory('userService', ['$http', function ($http) {

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

app.factory('agendaService', ['$http', function ($http) {

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

app.factory('sqlService', ['$http', function ($http) {

    var urlBase = '/api/sql';
    var sqlService = {};

    sqlService.doQuery = function (cust) {
        return $http.post(urlBase, cust);
    };

    sqlService.queryProductsStock = function () {
        return $http.get(urlBase + '/products/stock');
    };

    sqlService.queryProductsPrices = function () {
        return $http.get(urlBase + '/products/prices');
    };

    sqlService.queryProductsInventarioVentas = function (cust) {
        return $http.post(urlBase + '/products/movimiento', cust);
    };

    sqlService.queryProductInventarioVentas = function (id, cust) {
        return $http.post(urlBase + '/products/movimiento/' + id, cust);
    };

    sqlService.queryProductsUtility = function () {
        return $http.get(urlBase + '/products/utility');
    };

    sqlService.queryClientes = function () {
        return $http.get(urlBase + '/clientes');
    };
    
    sqlService.queryCliente = function (id) {
        return $http.get(urlBase + '/clientes/' + id );
    };

    sqlService.queryProductEnCamino = function (id) {
        return $http.get(urlBase + '/products/encamino/' + id );
    };

    sqlService.queryTransaction = function (id) {
        return $http.get(urlBase + '/comprobante/' + id );
    };

    sqlService.queryClienteTransactions = function (id) {
        return $http.get(urlBase + '/cliente/transactions/' + id );
    };




    return sqlService;
}]);

app.factory('pdfService', ['$http', function ($http) {

    var urlBase = '/api/pdf';
    var pdfService = {};

    pdfService.doPDF = function () {
        return $http.get(urlBase);
    };

    return pdfService;
}]);


app.factory('xlsImportService', ['$http', function ($http) {

    var urlBase = '/api/xls';
    var xlsImportService = {};

    xlsImportService.doImport = function () {
        return $http.get(urlBase);
    };

    return xlsImportService;
}]);