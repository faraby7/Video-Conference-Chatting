"use strict";

var app = angular.module('privacyapp', ['ui.router']);


app.config(function ($stateProvider, $urlRouterProvider) {
    var createState = function (alias, params) {
        $stateProvider.state(alias, params);
    };

    createState("home", { url: "/", templateUrl: "./app/view/templates/view.html" });
    createState("registration", { url: "/registration", templateUrl: "./app/view/templates/registration/registration.html" });
    createState("login", { url: "/login", templateUrl: "./app/view/templates/login/login.html" });
    createState("profile", { url: "/profile/:username", templateUrl: "./app/view/templates/profile/profile.html" });
    createState("myroom", { url: "/myroom/:username", templateUrl: "./app/view/templates/MyRooms/myrooms.html" });


    $urlRouterProvider.otherwise("/");
});

module.exports = app;