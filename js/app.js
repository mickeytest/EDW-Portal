'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
  'phonecatDirectives',
  'angularUtils.directives.dirPagination',
  'ui.bootstrap',
  'ngAnimate',
  'ngSanitize',
  "ngCsv",
  'MassAutoComplete'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/homepage', {
        templateUrl: 'partials/homepage.html',
      }).

      when('/performance', {
        templateUrl: 'partials/Performance.html',
        controller: 'PerforamnceCtrl'
      }).
      when('/baselinemetric', {
        templateUrl: 'partials/bmetric.html',
        controller: 'BmetricCtrl'
      }).
     when('/devoncalltrend', {
        templateUrl: 'partials/dev-oncalltrend.html',
         controller: 'DevOnCallTrendCtrl'
      }).
     when('/yottaplatformtrend', {
        templateUrl: 'partials/yottaplatformtrend.html',
         controller: 'yottaPlatformTrendCtrl'
      }).
     when('/seaquestplatformtrend', {
        templateUrl: 'partials/seaquestplatformtrend.html',
         controller: 'seaquestPlatformTrendCtrl'
      }).
     when('/dataqualitytrend', {
        templateUrl: 'partials/dataqualitytrend.html',
         controller: 'dataQualityTrendCtrl'
      }).
     when('/changemanagementtrend', {
        templateUrl: 'partials/changemanagementtrend.html',
         controller: 'changeManagementTrend'
      }).
     when('/releasemanagementtrend', {
        templateUrl: 'partials/releasemanagementtrend.html',
         controller: 'releaseManagementTrendCtrl'
      }).
     when('/edwonboardingtrend', {
        templateUrl: 'partials/edwonboardingtrend.html',
         controller: 'edwOnBoardingTrendCtrl'
      }).
      when('/edwoptimizationtrend', {
        templateUrl: 'partials/edwoptimizationtrend.html',
         controller: 'edwOptimizationTrendCtrl'
      }).
     when('/uamtrend', {
        templateUrl: 'partials/uamtrend.html',
        controller: 'uamTrendCtrl'
      }).
     when('/devoncall', {
        templateUrl: 'partials/devoncall.html',
        controller: 'OnCallErrorCtrl'
      }).
     when('/yottaplatform', {
        templateUrl: 'partials/yottaplatform.html',
        // controller: 'yottaplatform'
      }).
     when('/seaquestplatform', {
        templateUrl: 'partials/seaquestplatform.html',
        // controller: 'seaquestplatform'
      }).
     when('/dataquality', {
        templateUrl: 'partials/dataquality.html',
         controller: 'dataQualityCtrl'
      }).
     when('/changemanagement', {
        templateUrl: 'partials/changemanagement.html',
        // controller: 'changemanagement'
      }).
     when('/releasemanagement', {
        templateUrl: 'partials/releasemanagement.html',
       controller: 'RollupErrorCtrl'
      }).
     when('/edwonboarding', {
        templateUrl: 'partials/edwonboarding.html',
        // controller: 'edwonboarding'
      }).
     when('/uam', {
        templateUrl: 'partials/uam.html',
        // controller: 'dialoperation'
      }).
      when('/cpm/:env/:date', {
        templateUrl: 'partials/cpm.html',
        controller: 'CPMCtrl'
      }).
      when('/cpm', {
        templateUrl: 'partials/cpm.html',
        controller: 'CPMCtrl'
      }).
      when('/fileloading', {
        templateUrl: 'partials/fload.html',
        controller: 'FloadCtrl'
      }).
      when('/ranalytic', {
        templateUrl: 'partials/ranalytic.html',
        controller: 'RAnalyticCtrl'
      }).
      when('/lanalytic', {
        templateUrl: 'partials/lanalytic.html',
        controller: 'LAnalyticCtrl'
      }).
      when('/bdsticket', {
        templateUrl: 'partials/bdsticket.html',
        controller: 'BDSTicketCtrl'
      }).
      when('/performanceDetail/:date/:env', {
        templateUrl: 'partials/performanceDetail.html',
        controller: 'PerformanceDetailCtrl'
      }).
      when('/cpmDetail/:env/:eventid/:date', {
        templateUrl: 'partials/cpmDetail.html',
        controller: 'cpmDetailCtrl'
      }).
      when('/cpmDetail/:env/:eventid', {
        templateUrl: 'partials/cpmDetail.html',
        controller: 'cpmDetailCtrl'
      }).
      when('/changemanagement', {
        templateUrl: 'partials/changemanagement.html',
        controller: 'Changemanagement'
      }). 
      when('/slametric', {
        templateUrl: 'partials/rollupsla.html',
        controller: 'RollupSLACtrl'
      }).  
      when('/slametricreason/:env/:mecmonth', {
        templateUrl: 'partials/rollupslareason.html',
        controller: 'RollupSLAReasonCtrl'
      }). 
      when('/requestSubscribe', {
        templateUrl: 'partials/requestsubscribe.html',
        controller: 'RequestCtrl'
      }). 
      when('/requestHandlerForAdmin', {
        templateUrl: 'partials/requesthandle.html',
        controller: 'RequestHandleCtrl'
      }). 
      when('/midmtimtpinfo', {
        templateUrl: 'partials/midmtimtpinfo.html',
        controller: 'MidMTIMTPCtrl'
      }). 
      when('/rollupbyportolio', {
        templateUrl: 'partials/rollupbyportolio.html',
        controller: 'RollupByPortfolioCtrl'
      }). 
      when('/devopsreport', {
        templateUrl: 'partials/devopsreport.html',
        controller: 'DevOpsReportCtrl'
      }).
      when('/mecsummary', {
        templateUrl: 'partials/mecsummary.html',
        controller: 'mecSummaryCtrl'
      }). 
      when('/mecsummary_edit', {
        templateUrl: 'partials/mecsummaryedit.html',
        controller: 'mecSummaryEditCtrl'
      }). 
      when('/mcdfc', {
        templateUrl: 'partials/mcdfc.html',
        controller: 'mcdfcCtrl'
      }). 
      when('/tmpChart', {
        templateUrl: 'partials/tmpChart.html',
        controller: 'tmpChartCtrl'
      }). 
      otherwise({
        redirectTo: '/homepage'
      });
  }]);

