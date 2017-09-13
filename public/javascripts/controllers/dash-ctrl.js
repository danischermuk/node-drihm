angular.module('RDash')
.controller('DashCtrl', ['$state', '$scope', '$location','$mdSidenav', '$timeout', 'userService', 'sqlService',  'socket', '$mdDialog', '$stateParams', 'NgTableParams',  DashCtrl]);


function DashCtrl($state, $scope, $location, $mdSidenav, $timeout, userService, sqlService, socket,  $mdDialog, $stateParams, NgTableParams) {
	console.log("dash ctrl open");
	
}