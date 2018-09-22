"use strict";
var app = require('./app');
var homeController = function ($scope, $window, $state, logOutService) {
  console.log('homeController!');
  $scope.logState = false;
  if ($window.sessionStorage.getItem('token')) {
    // console.log('TOKEN IS FIN: '+$window.sessionStorage.getItem('token'));
    $scope.logState = true;
  }
  $scope.currentMenu = 'view';  
  $scope.logout = function () {
    logOutService.logout().then(function (response) {
      // $window.sessionStorage.setItem('token') = undefined;
      sessionStorage.removeItem('token');
      $scope.logState = false;
      console.log('Successfully Logged Out!');
      $state.go("home");
    }, function (success) {
      // callback(success);              
      console.log('Success!');
    }, function (error) {
      // errorCallback(error);
      console.log('Error!');
    })


  };
};

app.controller("homeController", ['$scope', '$window', '$state', 'logOutService', homeController]);

module.exports = app;
