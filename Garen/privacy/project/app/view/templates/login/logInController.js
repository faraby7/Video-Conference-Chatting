"use strict";
var app = require('../../../app');


var logInController = function ($scope, loginservice, $state, $window) {

    console.log('login Controller');
    $scope.logIn = function () {
        loginservice.makeLogin($scope.username, $scope.password).then(function (response) {

            console.log('TOKEN IS: ');
            console.log(response.data["token"]);
            console.log('sending username: '+$scope.username);
            $window.sessionStorage.setItem('token', response.data["token"]);
            $state.go("profile", {"username": $scope.username});

        }, function (error) {
            alert("Password error please repeat");
        })


    };

};

app.controller("logInController", ['$scope', 'loginservice', '$state', '$window', logInController]);
module.exports = app;
