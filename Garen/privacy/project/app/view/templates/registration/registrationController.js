"use strict";
var app = require('../../../app');


var registrationController = function ($scope, signupservice, $state, $window) {

    $scope.signUp = function () {

        signupservice.sign($scope.username, $scope.email, $scope.password).then(function (response) {
            $state.go('login');
        }, function (error) {
            alert("Something error in your Form");
        });
    };

};

app.controller("registrationController", ['$scope', 'signupservice','$state', '$window', registrationController]);
module.exports = app;
