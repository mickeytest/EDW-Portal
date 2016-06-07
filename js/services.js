'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

// phonecatServices.factory('myCPMService',function($rootScope) {
//     var sharedService = {};
    
//     sharedService.env = '';
//     sharedService.date = '';

//     sharedService.prepForBroadcast = function(env,date) {
//         this.env = env;
//         this.date = date;
//         this.broadcastItem();
//     };

//     sharedService.broadcastItem = function() {
//         $rootScope.$broadcast('handleBroadcast');
//     };

//     return sharedService;
// });