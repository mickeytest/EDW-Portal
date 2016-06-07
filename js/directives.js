'use strict';

/* Directives */

var DEFAULT_ID = '__default';
angular.module('phonecatDirectives', [])
.directive('chart', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            chartData: "=value",
            chartObj: "=chartobj"
        },
        transclude: true,
        replace: true,
        link: function($scope, $element, $attrs) {

            //Update when charts data changes
      $scope.$watch('chartData', function(value) {
        if (!value)
            return;
                // Initiate the chartData.chart if it doesn't exist yet
            $scope.chartData.chart = $scope.chartData.chart || {};

            // use default values if nothing is specified in the given settings
            $scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
            if ($attrs.type)
                $scope.chartData.chart.type = $scope.chartData.chart.type || $attrs.type;
            if ($attrs.height)
                $scope.chartData.chart.height = $scope.chartData.chart.height || $attrs.height;
            if ($attrs.width)
                $scope.chartData.chart.width = $scope.chartData.chart.width || $attrs.width;
            $scope.chartObj = new Highcharts.Chart($scope.chartData);
             });
         
        }
    };
})
.directive('stock', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            chartData: "=value",
            chartObj: "=chartobj"
        },
        transclude: true,
        replace: true,
        link: function($scope, $element, $attrs) {

            //Update when charts data changes
        $scope.$watch('chartData', function(value) {
        if (!value)
            return;
                // Initiate the chartData.chart if it doesn't exist yet
            $scope.chartData.chart = $scope.chartData.chart || {};

            // use default values if nothing is specified in the given settings
            $scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
           if ($attrs.type)
                $scope.chartData.chart.type = $scope.chartData.chart.type || $attrs.type;
            if ($attrs.height)
                $scope.chartData.chart.height = $scope.chartData.chart.height || $attrs.height;
            if ($attrs.width)
                $scope.chartData.chart.width = $scope.chartData.chart.width || $attrs.width;
            $scope.chartObj = new Highcharts.StockChart($scope.chartData);
             });
        }
    };
})
;
