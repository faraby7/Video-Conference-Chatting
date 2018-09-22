"use strict";

var app = require('../app');

var myroomsservice = function ($http) {

    this.rooms = function (username,Room) {

        console.log('user'+username+'room'+Room);

        var data = {
            "username": username,
            "room": Room,
        };

        let body = new FormData();
        body.append('username',username);
        body.append('Room',Room);
        return $http.post("http://localhost:8000/api/roomcreate/",body,{transformRequest:angular.identity,headers:{'content-type':undefined}});


    };


    this.roomslist = function (username) {

        return $http.get("http://localhost:8000/api/rooms/"+username+"/");

    };
};

app.service("myroomsservice",['$http',myroomsservice]);


module.exports = app;