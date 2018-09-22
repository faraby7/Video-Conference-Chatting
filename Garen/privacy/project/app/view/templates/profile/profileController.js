"use strict";
var app = require('../../../app');


var profileController = function ($scope, $state, $stateParams, $window) {    
    console.log('profileController Controller');
    $scope.username = $stateParams.username;
    console.log('token is '+$window.sessionStorage.getItem('token'));

    console.log($scope.username);


};

app.controller("profileController", ['$scope', '$state', '$stateParams', '$window', profileController]);
module.exports = app;