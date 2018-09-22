"use strict";

var app = require('./app');

var logOutService = function ($http) {
    this.logout = function () {
        console.log('Logging out...');
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/logout/',
            headers: {
                'Content-Type': "application/json"
            }
        });
    };

};

app.service("logOutService", ['$http', logOutService]);
module.exports = app;