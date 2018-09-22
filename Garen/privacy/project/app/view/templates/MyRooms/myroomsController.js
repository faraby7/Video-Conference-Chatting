"use strict";
var app = require('../../../app');


var myroomsController = function ($scope, myroomsservice, $state, $stateParams, $window) {

    $scope.username = $stateParams.username;
    myroomsservice.roomslist($scope.username).then(
        function successCallback(response) {
            console.log(response.data);
            $scope.listroom = response.data;
        }, function errorCallback(error) {

        }
    );


    $scope.roomsform = function () {
        $scope.username = $stateParams.username;
        myroomsservice.rooms($scope.username,$scope.Room).then(function (response) {
            console.log('ddd');
            $state.reload();
        }, function (error) {
            alert("Something error in your Form");
        });
    };
};

app.controller("myroomsController", ['$scope','myroomsservice', "$state", '$stateParams', '$window', myroomsController]);
module.exports = app;