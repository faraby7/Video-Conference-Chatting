"use strict";

var app = require('../app');

var signupservice = function ($http) {
    this.sign = function (username,email, password) {

        console.log('user'+username+'email'+email+'password'+password);
        var data = {
            "username": username,
            "email": email,
            "password": password
        };
        let body = new FormData();
        body.append('username',username);
        body.append('email',email);
        body.append('password',password);
        return $http.post("http://127.0.0.1:8000/api/signup/",body,{transformRequest:angular.identity,headers:{'content-type':undefined}})      ;


    };
};

app.service("signupservice",['$http',signupservice]);


module.exports = app;