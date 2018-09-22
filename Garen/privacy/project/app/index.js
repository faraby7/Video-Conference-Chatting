"use strict";
// import { Http, Headers, URLSearchParams } from '@angular/http';
var jquery = require('jquery');
var angular = require('angular');
require('@uirouter/angularjs');
require('./app');
require('./homeController');
require('./view/templates/login/logInController');
require('./view/templates/profile/profileController');
require('./view/templates/registration/registrationController');
require('./view/templates/MyRooms/myroomsController');
//services
require('./view/loginservice');
require('./logOutService');
require('./view/signupservice');
require('./view/myroomsservice');