"use strict";

var app = require('../app');

var loginservice = function ($http) {
    this.makeLogin = function (username, password) {
        console.log('Service Called to login user with username: ' + username + ' Password: ' + password);
        var data = {
            "username": username,
            "password": password
        };
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/login/',
            headers: {
                'Content-Type': "application/json"
            },
            data: JSON.stringify(data)
        });


    };
};

app.service("loginservice", ['$http', loginservice]);
module.exports = app;