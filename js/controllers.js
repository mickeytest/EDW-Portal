'use strict';
/* Controllers */


var baseURL = "http://16.152.122.101:3000"; 
var nodejsURL = "http://16.152.122.101:5555"; 
var myControllers = angular.module('phonecatControllers', []);

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function getDateByString(string){
    var res =  string.split(",")
    var month = res[0]
    var year = res[1]
    var date = ""
    if(month == 'Jan'){
        date = year + "-01"
    }else if(month == 'Feb'){
        date = year + "-02"
    }else if(month == 'Mar'){
        date = year + "-03"
    }else if(month == 'Apr'){
        date = year + "-04"
    }else if(month == 'May'){
        date = year + "-05"
    }else if(month == 'Jun'){
        date = year + "-06"
    }else if(month == 'Jul'){
        date = year + "-07"
    }else if(month == 'Aug'){
        date = year + "-08"
    }else if(month == 'Sep'){
        date = year + "-09"
    }else if(month == 'Oct'){
        date = year + "-10"
    }else if(month == 'Nov'){
        date = year + "-11"
    }else if(month == 'Dec'){
        date = year + "-12"
    }
    return date;
}

function getDatNotReadyChart(title){
 var chart = {
                title: {
                    text: title,
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            };
    return chart;
}

function getDefaultChart(){
    var chart = {
                title: {
                    text: "Loading <i class='fa fa-spinner fa-spin'></i>",
                    useHTML:true,
                    style: { fontSize: "45px" }
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            };
    return chart;
}

function getTrendDefaultChart(title, colors, data,drilldowndata, type){ //0:default: 1: DQClosedBySSIT

    var chart = {
                colors : colors,
                title:{text: title},
                xAxis: {
                   // categories:data.categories,
                   type: 'category',
                    gridLineWidth: 1,
                    gridLineDashStyle: 'shortdot'
                },
                
                yAxis: {
                    min: 0,
                    gridLineDashStyle: 'shortdot',
                    title: {
                        text: 'Count Numbers'
                    },
                },
                tooltip: {
                 shared: false,
                 formatter: function () {
                    var s = '';  
                    if (this.point.series.tooltipOptions.enabled == true){
                         s = this.point.name+'<br/>'+'<span style="color:'+this.point.color+'">\u25CF </span>'+this.series.name +
                          ': <b>'+ this.point.y +'</b>'; 
                     }else{
                        return false
                     }        
                  return s
                } 
                },
                plotOptions: {
                    series: {
                        marker: {
                            symbol: 'circle'
                        }
                    }
                },
                series:[],
                exporting:{enabled:false},
                credits:{enabled:false}
            };
    var i, j,z;
    for (i=0;i< data.data.length;i++){
        var item = {
             name: data.data[i].title,
             data: [],
             dataLabels: {
                         enabled: true
                     }
            }; 

        for(j=0;j<data.data[i].data.length;j++){
                item.data[j] = {
                    name: data.categories[j],
                    y: data.data[i].data[j][1],              
                }
                if(type == 1){   //closed by SSIT
                    item.data[j].y = data.data[i].data[j][2]
                    item.data[j].count = data.data[i].data[j][1]
                    item.dataLabels ={
                        enabled: true,
                        formatter:function(){
                           return Highcharts.numberFormat(this.point.y, 1)+'% (' + this.point.count + ')'
                        },
                    }
                }
                if (drilldowndata != null) {    
                    item.data[j].drilldown = drilldowndata.drilldownid[i][j]
                }
            }
        chart.series.push(item);
    }

     if (drilldowndata != null) {
        chart.drilldown = {
            series:[], 
        }

        var serisId = 0;
        for(z=0; z< drilldowndata.drilldownid.length; z++){
            for (i=0;i< drilldowndata.drilldownid[z].length;i++){
                chart.drilldown.series[serisId] = {
                    id:drilldowndata.drilldownid[z][i],
                    name:drilldowndata.drilldownid[z][i],
                    type: 'column',
                    dataLabels: {
                             enabled: true
                         },
                    data:[]
                }

                for(j=0; j< drilldowndata.drilldowncategories[z].length;j++){
                    if ( drilldowndata.drilldowndata[z][i][j] != null) {
                        var v = [
                            drilldowndata.drilldowncategories[z][j],
                            drilldowndata.drilldowndata[z][i][j]
                        ] 
                       chart.drilldown.series[serisId].data.push(v) 
                    }
                    
                }
                serisId += 1;
            }
        }
     }
    return chart;
}

function getCodeNamebyId(errorCodeList, code){
    if(errorCodeList[code] == null){
        return ''
    }else{
        return errorCodeList[code]
    }
}

function getPieWithDrillDown(data){
    var chart = {
                    chart: {
                        type: 'pie',
                          events: {
                            drillup: function (e) {
                               $("#query").val('').change();
                            }
                        } 
                    },
                    title: {
                        text: data.title
                    },   
                    subtitle:{
                        text: data.subtitle
                    },           
                    xAxis: {
                        type: 'category'
                    },

                    legend: {
                        enabled: false
                    },
                    credits: { enabled:false }, 
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            },
                             events: {
                                click: function (e) {
                                      $("#query").val(e.point.name).change();
                                }
                            }
                        },
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                             format: ' {point.name} ({point.percentage:.1f}%, {point.y}) ',      
                                style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true
                        }
                    },
                    tooltip: {

                         headerFormat: '',
                         pointFormat: '<span style="color:{point.color}">{point.name}:</span> {point.percentage:.1f}%, {point.y}'
                     },
                    series: [{
                        name: data.seriesname,
                        colorByPoint: true,
                        innerSize: '0%',
                        data: data.data
                    }],
                    drilldown: {
                        activeAxisLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        activeDataLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                         drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 65,   
                                x: 0
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 5,
                                states: {
                                    hover: {
                                        fill: 'rgba(238, 238, 224,.7)'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: 'rgba(238, 238, 224,.7)'
                                    }
                                }
                            }

                            },
                        series: []
                    }
            }
        for (var i=0;i<data.drilldown.length;i++){
           chart.drilldown.series[i] = {
                innerSize: '50%',
                id: data.drilldown[i].id,
                data: data.drilldown[i].data
            }    

            if(data.drilldowntype != null){
                chart.drilldown.series[i].type = data.drilldowntype
                chart.drilldown.series[i].tooltip = {
                            headerFormat: '',
                            pointFormat: '<span style="color:{point.color}">{point.name}: </span><b>{point.y}</b>'
                            }
            }
        }
    return chart
}

function drawErrorChart($scope,$http) {
    var url = baseURL+ "/server";
    $scope.mycharts = getDefaultChart();

    if ($scope.radioModel == 'Day'){ 
        $http.get(url + "?Environment="+ $scope.env + "&View=" + $scope.radioModel).success(function (data){
            $scope.mycharts = {   
                chart:{
                   // zoomType:'xy'
                },
                title: {
                    text: $scope.env + ' Recovery Summary',
                },

                xAxis: [{
                     type: 'datetime',      
                     crosshair: true,
                     tickInterval: 3600 * 1000 * 24,

                }],

                yAxis: [{
                  opposite: false,
               
                    title: {
                        text: 'Total Response Time (mins) ',
                        
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }],
                navigator: {
                    series: {
                   
                     fillOpacity: 0,
                     lineWidth: 10,
                  
                    }
                },
                 scrollbar: {
                    enabled:true,
                    barBackgroundColor: 'white',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: '#B6E7E7',
                        buttonBorderWidth: 0,
                        buttonArrowColor: '#B6E7E7',
                        buttonBorderRadius: 7,
                        rifleColor: '#B6E7E7',
                        trackBackgroundColor: '#B6E7E7',
                        trackBorderWidth: 1,
                        trackBorderColor: '#B6E7E7',
                        trackBorderRadius: 7
                },
                rangeSelector: {
                    enabled:true,
                    selected: 1,
                    buttons: [
                           {
                                type: 'day',
                                count: 1,
                                text: '1d'
                            },
                            {
                                type: 'week',
                                count: 1,
                                text: '1w'
                            }, 
                            {
                                type: 'month',
                                count: 1,
                                text: '1m'
                            }, {
                                type: 'month',
                                count: 3,
                                text: '3m'
                            }, {
                                type: 'month',
                                count: 6,
                                text: '6m'
                            }, {
                                type: 'all',
                                text: 'All'
                            }]
            
                },
                tooltip: {
                    shared: false,
                    formatter: function () {
                     var s = '';  
                        if (this.series.name.match('Average')){
                             s = '<span style="color:'+this.series.color+'">'+this.series.name +'</span>'+
                          ': <b>'+ this.point.y +'</b>';  
                        }else{

                            if (this.point.name == null){
                            s = '<span style="color:'+this.series.color+'">'+this.series.name +'</span>'+
                            '<br><b>Date: </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x);
                            '<br><b>Total: </b>'+this.point.stackTotal;
                            }else{
                               s = '<span style="color:'+this.series.color+'">'+this.series.name +'</span>'+
                            '<br><b>Date: </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x) +
                            '<br><b>MID '+this.point.name+': </b>'+this.point.y +
                            '<br><b>Total: </b>'+this.point.stackTotal; 
                            }
                            
                        }  
                     return s;
                  },
                },

                plotOptions: {
                    series: {
                        stacking:'normal',              
                        borderWidth: 1.5  ,
                         events: {
                                click: function (e) {
                                    //alert($("#query").val());
                                      $("#query").val(Highcharts.dateFormat('%y-%m-%d',e.point.x)).change();
                                     // $("#query").text(Highcharts.dateFormat('%y-%m-%d',e.point.x));
                                      //$scope.query = Highcharts.dateFormat('%y-%m-%d',e.point.x) ;
                                      //$scope.query = '15-09-02';
                                }
                            }
                    }
                },
                legend:{
                enabled: true},
                exporting: { enabled: true },
                credits: {
                    enabled: false
                },
            }; 
            $scope.mycharts.series = [];
            var stack = ["AO1","OC1","OC2","AO2"];
            var color = ["rgba(102, 204, 204, .7)","rgba(204, 102, 102, .7)",
                     "rgba(46, 138, 92, .7)","rgba(255, 204, 102, .7)"];
            var color_avg = ["#66CCCC","#CC6666","#2E8A5C","#FFCC66"];
            var title = ["AO Response Time","OnCall Response Time","OnCall Fix Time","AO Re-exec Time"];
            var i = 0 ;
            var j = 0 ;
            var day = 0;
            var month = 0;
            var year = 0;

            for (i = 0; i < title.length; i++) { 
                 $scope.mycharts.series[i] = {
                        type: 'column',    
                        name: title[i],
                        stack: stack[i],
                        color: color[i],
                        data:[]
                    };
            }

           

            for (i = 0; i < data.series.data.length; i++) { 
                var time = data.series.data[i].x.split("-");
                year = parseInt(time[0]);
                month = parseInt(time[1])-1;
                day = parseInt(time[2]);

               $scope.mycharts.series[0].data[i] = {
                name:data.series.data[i].name,
                y:data.series.data[i].AO1,
                x:Date.UTC(year, month, day)
               }
               $scope.mycharts.series[1].data[i] = {
                name:data.series.data[i].name,
                y:data.series.data[i].OC1,
                x:Date.UTC(year, month, day)
               }
               $scope.mycharts.series[2].data[i] = {
                name:data.series.data[i].name,
                y:data.series.data[i].OC2,
                x:Date.UTC(year, month, day)
               }

               $scope.mycharts.series[3].data[i] = {
                name:data.series.data[i].name,
                y:data.series.data[i].AO2,
                x:Date.UTC(year, month, day)
               }     
            }

            getPaginationData($scope, data.series.data, 25)
        }); 
    }else {
        $http.get(url + "?Environment="+ $scope.env + "&View=" + $scope.radioModel).success(function (data){
            $scope.mycharts = {
                scrollbar: {
                   enabled:true,
                    barBackgroundColor: 'white',
                    barBorderRadius: 7,
                    barBorderWidth: 0,
                    buttonBackgroundColor: '#B6E7E7',
                    buttonBorderWidth: 0,
                    buttonArrowColor: '#B6E7E7',
                    buttonBorderRadius: 7,
                    rifleColor: '#B6E7E7',
                    trackBackgroundColor: '#B6E7E7',
                    trackBorderWidth: 1,
                    trackBorderColor: '#B6E7E7',
                    trackBorderRadius: 7  
                },
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: $scope.env + ' Recovery Summary'
                },

                xAxis: {
                     categories:[
                                  
                    ],
                   crosshair: false
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Response Time (mins)'
                    }
                },
                tooltip: {                    //labels after moving mouse
                    shared: true,
                //              formatter: function () {
                //        return '<b>' + this.series.name + ':</b>' +
                //            this.point.y;
                //    }
                },
                credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                                enabled: false
                            },
                series: [{
                    name: 'Operation Response Time',
                    type: 'column',
                    color: 'rgba(102, 204, 204, .7)',
                    data:[]
                },
                  {
                    name: 'OnCall Response Time',
                    type: 'column',
                    color: 'rgba(204, 102, 102, .7)',
                    data:[]   
                       },
                  {
                    name: 'OnCall Fix Time',
                    type: 'column',
                    color: 'rgba(46, 138, 92, .7)',
                    data:[]  
                       },
                  {
                    name: 'Operation Re-exec Time',
                    type: 'column',
                    color: 'rgba(255, 204, 102, .7)',
                    data:[]  
                }]
            }
            var i = 0;
            for (i=0;i<=data.series.data.length -1;i++){
                $scope.mycharts.xAxis.categories[i] = data.series.data[i].x;
                $scope.mycharts.series[0].data[i] = data.series.data[i].AO1;
                $scope.mycharts.series[1].data[i] = data.series.data[i].OC1;
                $scope.mycharts.series[2].data[i] = data.series.data[i].OC2;
                $scope.mycharts.series[3].data[i] = data.series.data[i].AO2;
                
            }
        }); 
    }
}

function drawPerformanceChart($scope,$http){
       
    var url = baseURL+ "/performance";  
    $scope.Performancechart = getDefaultChart();
    $scope.Performancechart2 = getDefaultChart();

    $http.get(url + "?type=memory&Environment=" + $scope.env).success(function (data) {
        if(data && data.resultcode == '200'){  
          alert('data not ready');           
        } else{ 

            $scope.LastRollupStartTS = data.LastRollupStartTS
            $scope.LastRollupRowAcc = data.LastRollupRowAcc
            $scope.LastRollupDiskIO = data.LastRollupDiskIO
            $scope.LastRollupEndTS = data.LastRollupEndTS
            $scope.LastRollupRowIUD = data.LastRollupRowIUD
            $scope.LastRollupMemAll = data.LastRollupMemAll
            $scope.LastRollupElasped = data.LastRollupElasped
            $scope.LastRollupCPUBusy = data.LastRollupCPUBusy
            $scope.LastRollupMemUsed = data.LastRollupMemUsed

            $scope.Performancechart = {
                rangeSelector: {
                            selected: 1,
                            buttons: [
                               
                                {
                                    type: 'week',
                                    count: 1,
                                    text: '1w'
                                }, 
                                {
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }]
                        },
                scrollbar: {
                    enabled:true,
                    barBackgroundColor: 'white',
                    barBorderRadius: 7,
                    barBorderWidth: 0,
                    buttonBackgroundColor: '#B6E7E7',
                    buttonBorderWidth: 0,
                    buttonArrowColor: '#B6E7E7',
                    buttonBorderRadius: 7,
                    rifleColor: '#B6E7E7',
                    trackBackgroundColor: '#B6E7E7',
                    trackBorderWidth: 1,
                    trackBorderColor: '#B6E7E7',
                    trackBorderRadius: 7
                },
                chart: {
                                zoomType: 'xy'          
                            },
                title: {
                                text: 'Mem Alloc & Disk IO & CPU Busy & Elapsed Time charts'
                            },
                navigator: {                        //get rid of the spline in scrollbar
                            series: {
                               
                              fillOpacity: 0,
                                lineWidth: 0,
                              
                            }
                        },
                credits: {
                    enabled: false
                },
                subtitle: {
                            text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                        },
                    plotOptions: {
                                series: {
                                    pointInterval: 24 * 3600 * 1000 , // one day,
                                    events: {
                                        click: function (e) {
                                            var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                             
                                           // window.location.href = "#/performanceDetail/"+date+"/"+$scope.env;                                    
                                            window.location.href = "#/performanceDetail/"+date+"/"+$scope.env;                                    
                            
                                         }
                                    }
                                },
                                
                            },
                    xAxis: {
                                type:'datetime',                           
                            },  
                    yAxis: [

                            { // Primary yAxis

                                labels: {
                                    format: '{value} Gb',
                                    style: {
                                        color: 'rgba(51, 204, 51, .6)'
                                    }
                                },
                                title: {
                                    text: 'Mem Alloc(Gb)',
                                    style: {
                                        color: 'rgba(51, 204, 51, .6)'
                                    }
                                },
                                opposite: false,
                            }, 
                            { // Secondary yAxis
                             gridLineWidth: 0,     
                                title: {
                                    text: 'Disk IO Total(million)',
                                    style: {
                                        color: 'rgba(51,204,51,1)'
                                    }
                                },
                                labels: {
                                    format: '{value} million',
                                    style: {
                                        color:'rgba(51,204,51,1)'
                                    }
                                },
                                opposite: false,    //add
                            },
                            { // Tertiary yAxis
                                gridLineWidth: 0,
                                title: {
                                    text: 'CPU Busy (H)',
                                    style: {
                                        color: 'rgba(36, 143, 36, 1)'
                                    }
                                },
                                labels: {
                                    format: '{value} h',
                                    style: {
                                        color: 'rgba(36, 143, 36, 1)'
                                    }
                                },
                                opposite: true
                            },
                            { //Quartus yAxis
                                gridLineWidth: 0,     
                                title: {
                                    text: 'Elapsed Time(H)',
                                    style: {
                                        color: "rgba(255, 153, 51, 1)"
                                    }
                                },
                                labels: {
                                    format: '{value} h',
                                    style: {
                                        color: "rgba(255, 153, 51, 1)"
                                    }
                                },
                                opposite: true    //add
                            }
                        ],
                        tooltip: {
                            // formatter: function() {
                            //       return '<b>'+this.x+' '+this.series.name+'</b>'; 
                            // }
                             shared: true
                        },
                         legend: {
                            enabled: true,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            shadow: true
                        }
                };

                var i ,j,z;
                var day,month,year;
                $scope.Performancechart.series = [];

                for( i = 0; i < data.Data.length; i++){
                    $scope.Performancechart.series[i] = {
                        name: data.Data[i].name
                    };

                    $scope.Performancechart.series[i].data = [];
                    for(j = 0; j<data.Data[i].dataset.length; j++){
                        var time = data.Data[i].dataset[j].x.split("-")
                        year = parseInt(time[0]);
                        month = parseInt(time[1])-1;
                        day = parseInt(time[2]);
                         $scope.Performancechart.series[i].data[j] = {
                            x:Date.UTC(year, month, day),
                            y:data.Data[i].dataset[j].y
                        };   
                    }          
                    
                    
                  
                    if(data.Data[i].name.match("Mem Alloc")){
                        $scope.Performancechart.series[i].type = 'column';
                       // $scope.Performancechart.series[i].yAxis = 1;
                        $scope.Performancechart.series[i].color = 'rgba(153, 255, 153, .9)';
                    };
                    if(data.Data[i].name.match('Disk IO')){
                        $scope.Performancechart.series[i].type = 'column';
                        $scope.Performancechart.series[i].yAxis = 1;
                        $scope.Performancechart.series[i].color = 'rgba(51,204,51,.75)';  
                    };
                    if(data.Data[i].name.match('CPU')){
                        $scope.Performancechart.series[i].type = 'column';
                        $scope.Performancechart.series[i].yAxis = 2;
                        $scope.Performancechart.series[i].color = 'rgba(36, 143, 36,.85)';  
                    };
                    if(data.Data[i].name.match('Elapsed Time')){
                        $scope.Performancechart.series[i].type = 'spline';
                        $scope.Performancechart.series[i].yAxis = 3;
                        $scope.Performancechart.series[i].color = 'rgba(255, 153, 51, .7)';

                    };

                }
            }   
    });
    
    $http.get(url + "?type=row&Environment=" + $scope.env).success(function (data) {
        if(data && data.resultcode == '200'){  
            alert('data not ready');            
        } else{  
            $scope.Performancechart2 = {
                rangeSelector: {
                            selected: 1,
                            buttons: [
                               
                                {
                                    type: 'week',
                                    count: 1,
                                    text: '1w'
                                }, 
                                {
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }]
                        },
                scrollbar: {
                    enabled:true,
                    barBackgroundColor: 'white',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: '#B6E7E7',
                        buttonBorderWidth: 0,
                        buttonArrowColor: '#B6E7E7',
                        buttonBorderRadius: 7,
                        rifleColor: '#B6E7E7',
                        trackBackgroundColor: '#B6E7E7',
                        trackBorderWidth: 1,
                        trackBorderColor: '#B6E7E7',
                        trackBorderRadius: 7
                },
                chart: {
                                zoomType: 'xy'          
                            },
                title: {
                                text: 'Rows Accessed & Rows IUD & File size & Elapsed Time charts'
                            },
                navigator: {                        //get rid of the spline in scrollbar
                                series: {
                                   
                                  fillOpacity: 0,
                                    lineWidth: 0,
                                  
                                }
                },
                credits: {
                        enabled: false
                },
                 subtitle: {
                                text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                            },
                plotOptions: {
                                series: {
                                    pointInterval: 24 * 3600 * 1000,// one day,
                                    events: {
                                        click: function (e) {
                                            var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                             
                                            window.location.href = "#/performanceDetail/"+date+"/"+$scope.env;                                    
                                         }
                                    }
                                }
                            },
                xAxis: {
                                type:'datetime', 
                                crosshair:true   
                            },  
                yAxis: [
                        { // Primary yAxis

                            labels: {
                                format: '{value} million',
                                style: {
                                    color: 'rgba(159, 191, 223, .9)'
                                }
                            },
                            title: {
                                text: 'Rows Accessed Total(million)',
                                style: {
                                    color: 'rgba(159, 191, 223, .9)'
                                }
                            },
                            opposite: false,
                        }, 
                        { // Secondary yAxis
                         gridLineWidth: 0,     //add
                            title: {
                                text: 'Rows IUD Total(million)',
                                style: {
                                    color: 'rgba(128,128,255,1)'
                                }
                            },
                            labels: {
                                format: '{value} million',
                                style: {
                                    color: 'rgba(128,128,255,1)'
                                }
                            },
                            opposite: false,    //add
                        },
                        { // Tertiary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'File size (Gb)',
                                style: {
                                    color: 'rgba(31, 31, 122, 1)'
                                }
                            },
                            labels: {
                                format: '{value} Gb',
                                style: {
                                    color:'rgba(31, 31, 122, 1)'
                                }
                            },
                            opposite: true,
                        },
                        { //Quartus yAxis
                            gridLineWidth: 0,     
                            title: {
                                text: 'Elapsed Time(H)',
                                style: {
                                    color: "rgba(255, 153, 51, 1)"
                                }
                            },
                            labels: {
                                format: '{value} h',
                                style: {
                                    color: "rgba(255, 153, 51, 1)"
                                }
                            },
                            opposite: true    //add
                        }
                        ],
                        tooltip: {
                            shared: true
                        },
                          legend: {
                            enabled: true,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            shadow: true
                        }
            };


            var i,j;
            var day,month,year;
            $scope.Performancechart2.series = [];



            for( i = 0; i < data.Data.length; i++){

                $scope.Performancechart2.series[i] = {
                    name: data.Data[i].name    

                };
               
                $scope.Performancechart2.series[i].data = [];
                for(j = 0; j<data.Data[i].dataset.length; j++){
                    var time = data.Data[i].dataset[j].x.split("-");
                    year = parseInt(time[0]);
                    month = parseInt(time[1])-1;
                    day = parseInt(time[2]);

                     $scope.Performancechart2.series[i].data[j] = {
                        x:Date.UTC(year,month,day),
                        y:data.Data[i].dataset[j].y
                    };   
                }          
                
                  if(data.Data[i].name.match('Rows Accessed')){
                    $scope.Performancechart2.series[i].type = 'column';
                    $scope.Performancechart2.series[i].color = 'rgba(159, 191, 223, .7)';
                };            
                if(data.Data[i].name.match("Rows IUD")){
                    $scope.Performancechart2.series[i].type = 'column';
                    $scope.Performancechart2.series[i].yAxis = 1;
                    $scope.Performancechart2.series[i].color = 'rgba(128,128,255,.85)';
                };
                if(data.Data[i].name.match('File size')){                    
                    $scope.Performancechart2.series[i].type = 'column';
                    $scope.Performancechart2.series[i].yAxis = 2;
                    $scope.Performancechart2.series[i].color = 'rgba(31, 31, 122,.65)';   
                };
               if(data.Data[i].name.match('Elapsed Time')){
                    $scope.Performancechart2.series[i].type = 'spline';
                    $scope.Performancechart2.series[i].yAxis = 3;
                    $scope.Performancechart2.series[i].color = 'rgba(255, 153, 51, .7)';

                };                
            }

        }
    });
}

function drawRollupErrorChart($scope,$http){
    var url = baseURL+ "/error";
    $scope.rolluperrorchart1= getDefaultChart();
    $scope.rolluperrorchart2= getDefaultChart();
    $http.get(url + "?Environment="+ $scope.env).success(function (data) {     
        $scope.rolluperrorchart1 = {
                rangeSelector: {
                            selected: 1,
                            buttons: [
                                {
                                    type: 'day',
                                    count: 1,
                                    text: '1d'
                                }, 
                                {
                                    type: 'week',
                                    count: 1,
                                    text: '1w'
                                }, 
                                {
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }]
                        },
                 scrollbar: {
                    enabled:true,
                    barBackgroundColor: 'white',
                    barBorderRadius: 7,
                    barBorderWidth: 0,
                    buttonBackgroundColor: '#B6E7E7',
                    buttonBorderWidth: 0,
                    buttonArrowColor: '#B6E7E7',
                    buttonBorderRadius: 7,
                    rifleColor: '#B6E7E7',
                    trackBackgroundColor: '#B6E7E7',
                    trackBorderWidth: 1,
                    trackBorderColor: '#B6E7E7',
                    trackBorderRadius: 7  
                 },
                 navigator: {                        //get rid of the spline in scrollbar
                    series: {
                       
                      fillOpacity: 0,
                        lineWidth: 0,
                      
                    }
                },
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Multiple Rollup Recovery & Elapsed Time charts - Time Based'
                },
                xAxis: [{
                    categories: 'datetime',
                    crosshair: true
                     }],
                yAxis: [
                { // Primary yAxis
                    min: 0,
                    title: {
                        text: 'Duration (m)'
                    },
                     opposite: false
                }, 
                                        {// Secondary yAxis
                    title: {
                        text: 'Elapsed Time(m)'
                    },
                    opposite: true
                }],
                 legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    shadow: true
                },

              tooltip: {               
                    shared          : true,
                 /*   formatter: function () { 
                    var s = '<b>Date:  </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x)+
                    '<br><b>Rollup error: </b>'+'<span style="color:#A5AAD9;">Total </span>'+'<b>'+this.points[0].y+'  |  ' +'</b>'+'<span style="color:#996DA2;"> Oncall </span>'+'<b>'+this.points[1].y+'</b>'+
                    '<br><b>System error: </b>'+'<span style="color:#F8A13F;">Total </span>'+'<b>'+this.points[2].y+'  |  ' +'</b>'+'<span style="color:#BA3C3D;"> Oncall </span>'+'<b>'+this.points[3].y+'</b>'+
                    '<br><b>Error in Critical Path: </b>'+'<span style="color:#33CC33;">Total </span>'+'<b>'+this.points[4].y+'  |  ' +'</b>'+'<span style="color:#1F7A1F;"> Oncall </span>'+'<b>'+this.points[5].y+'</b>'+
                    '<br><b>Elapse Time(Hours): </b>'+this.points[6].y;
                    return s;            
                      }   */
                    },
             
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                                enabled: false                 //Credits ??   (???,???true)
                            }
        }

        $scope.rolluperrorchart1.series = [];
        var color = ["rgba(165,170,217,1)","rgba(126,86,134,.9)",
        "rgba(248,161,63,1)","rgba(186,60,61,.9)",
        "rgba(51, 204, 51, .6)","rgba(36, 143, 36, 1)",
        "rgba(51, 102, 153, 1)"];

       
        var pointPadding = [0.3,0.4,0.3,0.4,0.3,0.4]
        var pointWidth = [20,10,20,10,20,10]
        var pointPlacement = [-0.25,-0.25,0,0,0.25,0.25]
        var i,j;
        var year, month, day;
        for( i = 4; i < data.Time.length-1; i++){
            $scope.rolluperrorchart1.series[i-4] = {
                    name: data.Time[i].name ,   
                    color: color[i],
                    pointPadding: pointPadding[i],
                    pointWidth: pointWidth[i],
                    pointPlacement: 0,
                    type: 'column',
                };
        }
        $scope.rolluperrorchart1.series[2] = {
                name: data.Time[6].name ,   
                color: color[6],
                type: 'spline',
                tooltip: {
                    valueSuffix: 'h'
                },
                yAxis: 1
        }
        for( i = 4; i < data.Time.length; i++){        
            $scope.rolluperrorchart1.series[i-4].data = [];
            for(j = 0; j<data.Time[i].dataset.length; j++){
                var time = data.Time[i].dataset[j].x.split("-");
                year = parseInt(time[0]);
                month = parseInt(time[1])-1;
                day = parseInt(time[2]);
                 $scope.rolluperrorchart1.series[i-4].data[j] = {
                    x:Date.UTC(year, month, day),
                    y:data.Time[i].dataset[j].y
                };   
            }    
        }

        $scope.rolluperrorchart2 = {
                rangeSelector: {
                            selected: 1,
                            buttons: [
                                {
                                    type: 'day',
                                    count: 1,
                                    text: '1d'
                                }, 
                                {
                                    type: 'week',
                                    count: 1,
                                    text: '1w'
                                }, 
                                {
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }]
                        },
                 scrollbar: {
                 enabled:true,
                 barBackgroundColor: 'white',
                    barBorderRadius: 7,
                    barBorderWidth: 0,
                    buttonBackgroundColor: '#B6E7E7',
                    buttonBorderWidth: 0,
                    buttonArrowColor: '#B6E7E7',
                    buttonBorderRadius: 7,
                    rifleColor: '#B6E7E7',
                    trackBackgroundColor: '#B6E7E7',
                    trackBorderWidth: 1,
                    trackBorderColor: '#B6E7E7',
                    trackBorderRadius: 7  
                },
                navigator: {                        //get rid of the spline in scrollbar
                    series: {
                       
                      fillOpacity: 0,
                        lineWidth: 0,
                      
                    }
                },
               // navigator : {                   //navigation Bar ???
                //        enabled : false
                //    },
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Multiple Rollup Recovery & Elapsed Time charts - Number Based'
                },
                xAxis: [{
                    categories: 'datetime',
                    crosshair: true
                     }],
                yAxis: [
                { // Primary yAxis
                    min: 0,
                    title: {
                        text: 'Numbers'
                    },
                    opposite: false
                }, 
                {// Secondary yAxis
                    title: {
                        text: 'Elapsed Time(H)'
                    },
                    opposite: true
                }],
                 legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    shadow: true
                },
              tooltip: {               
                    shared          : true,
                 /*   formatter: function () { 
                    var s = '<b>Date:  </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x)+
                    '<br><b>Rollup error: </b>'+'<span style="color:#A5AAD9;">Total </span>'+'<b>'+this.points[0].y+'  |  ' +'</b>'+'<span style="color:#996DA2;"> Oncall </span>'+'<b>'+this.points[1].y+'</b>'+
                    '<br><b>System error: </b>'+'<span style="color:#F8A13F;">Total </span>'+'<b>'+this.points[2].y+'  |  ' +'</b>'+'<span style="color:#BA3C3D;"> Oncall </span>'+'<b>'+this.points[3].y+'</b>'+
                    '<br><b>Error in Critical Path: </b>'+'<span style="color:#33CC33;">Total </span>'+'<b>'+this.points[4].y+'  |  ' +'</b>'+'<span style="color:#1F7A1F;"> Oncall </span>'+'<b>'+this.points[5].y+'</b>'+
                    '<br><b>Elapse Time(Hours): </b>'+this.points[6].y;
                    return s;            
                      }   */
                    },
             
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                                enabled: false                 //Credits ??   (???,???true)
                            },
        };

        $scope.rolluperrorchart2.series = [];
        for( i = 4; i < data.Number.length-1; i++){
            $scope.rolluperrorchart2.series[i-4] = {
                    name: data.Number[i].name ,   
                    color: color[i],
                    pointPadding: pointPadding[i],
                    pointWidth: pointWidth[i],
                    pointPlacement: 0,
                    type: 'column',
                };
        }
        $scope.rolluperrorchart2.series[2] = {
                    name: data.Number[6].name ,   
                    color: color[6],
                    type: 'spline',
                    tooltip: {
                        valueSuffix: 'h'
                    },
                    yAxis: 1
            }
        for( i = 4; i < data.Number.length; i++){
            $scope.rolluperrorchart2.series[i-4].data = [];
            for(j = 0; j<data.Number[i].dataset.length; j++){
                var time = data.Number[i].dataset[j].x.split("-");
                year = parseInt(time[0]);
                month = parseInt(time[1])-1;
                day = parseInt(time[2]);
                 $scope.rolluperrorchart2.series[i-4].data[j] = {
                    x:Date.UTC(year, month, day),
                    y:data.Number[i].dataset[j].y
                };   
            }    
        }
    });
}

function performSearch($scope, data) {
    $scope.events = data.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);   
}

function getPaginationData($scope, data, defaultPageSize){
            $scope.pageSize = defaultPageSize;
            $scope.currentPage = 1;
            $scope.total = data.length;

            $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            }
           
            $scope.pageChanged = function () {
                performSearch($scope,data);
            };  

            $scope.$watch('pageSize', function() {
                 performSearch($scope,data);
            })
            $scope.change = function () {
                if( $scope.query == ''){
                   $scope.pageSize = defaultPageSize;
                   $scope.currentPage = 1;
                   performSearch($scope,data);
                   
                }else{
                  $scope.pageSize = $scope.total;
                   $scope.currentPage = 1;
                   performSearch($scope,data);
                   
                }
           
            };
            performSearch($scope,data);
}

function drawCriticalPathChart($scope,$http){
    //var url = "http://127.0.0.1:3000/cpm";
   var url = baseURL+ "/cpm";
    var date = getFormatDate($scope.dt); 
    $scope.cpm = getDefaultChart();
    $scope.datafound = false;
     console.log(url + "?Server="+ $scope.env + "&RollupDate=" + date)
      $http.get(url + "?Server="+ $scope.env + "&RollupDate=" + date).success(function (data){
        console.log($scope.data)
          $scope.data = data;
      //$http.get("phones/cpm.json").success(function (data){          
        if(data && data.resultcode == '200'){  
           alert('data not ready');           
        }else if (data.data == null){
            $scope.cpm = {
                chart: {
                        type: 'columnrange',
                        inverted: true,
                },
                title: {
                    text: 'Sorry, Chart for ' + $scope.env + ' - ' + date + ' is not ready in our portal, please contact the admin.'
                },
                subtitle: {
                        text: 'Observed for '+ $scope.env + ' - ' + date
                },
            };
            $scope.datafound = false;
        }else{ 

            if($scope.viewby == 'job'){
                drawCriticalPathByJobChart($scope)
            }else if ($scope.viewby == 'time'){
                drawCriticalPathByTimeChart($scope)
            }else if ($scope.viewby == 'portfolio'){
                drawCriticalPathByPortfolioChart($scope)
            }
            $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            }
            $scope.events = data.data;

           // getPaginationData($scope, data.data, 150);
            $scope.datafound = true;
        }   
    });     
}

function drawCriticalPathByJobChart($scope){
    var date = getFormatDate($scope.dt); 
            var data = $scope.data
            $scope.cpm = {            
                    chart: {
                        type: 'columnrange',
                        inverted: true,

                    },
                    credits:{enabled:false},
                    title: {
                        text: 'Critical Path and Long Running Jobs Chart'
                    },

                    subtitle: {
                        text: 'Observed for '+ $scope.env + ' - ' + date
                    },
                    xAxis: {
                        reversed: false,
                            //max:0,
                           
                            labels: {
                                enabled:false,
                                style: {
                                    color: "rgba(0, 0, 51, .7)"
                               },
                             
                            },
                           title: {
                                text: 'Critical Path vs Long Running Jobs',
                                style: {
                                    color: "rgba(0, 0, 51, .7)"
                                }
                            },
                               plotLines: [{ // mark the weekend
                                color: '#FF6600',
                                width: 2,
                                value: 0,
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Above Critical Path",
                                    verticalAlign: 'middle', 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            },{ // mark the weekend
                                color: '#FF6600',
                                width: 2,
                                value: 0,
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Below Long Running Jobs",
                                    verticalAlign: 'middle',
                                    y: +15, 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            }],
                             
                        },

                    yAxis: {
                        type: 'datetime',
                        title: {
                            text: 'TIME ( Local )'
                        }
                    },

                    tooltip: {            
                    positioner: function(boxWidth, boxHeight, point) {
                        var x,y;

                        if (point.plotX < 200){
                            x = point.plotX + 20
                        }else{
                            x =  point.plotX -130
                        }

                         if (point.plotY < 150){
                            y =  point.plotY + 120
                         }else{
                            y =  point.plotY - 40
                         }

                         return {
                            x:x,
                            y:y

                         }
                        
                    },
                     useHTML: true,
                        formatter: function () {
                            if (this.point.per == null){
                                var env = $scope.env=='ITG'? 'ITG1':($scope.env=='EMR'? 'PRO1' : ($scope.env=='ZEO'? 'PRO2':'PRO3'))
                                var url = "http://g4w1128.houston.hp.com/dialadmin/" + env + "/dialMonitor.aspx?mode=Tasks&batch_id=" + this.point.bid

                                return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Batch ID: <a href="'+ url +'" target="_blank">'+this.point.bid+'</a><br/><b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); 
                             }
                           else if(this.point.bid == null){
                                return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>EstimateStartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); 
                             }
                            else{
                                var env = $scope.env=='ITG'? 'ITG1':($scope.env=='EMR'? 'PRO1' : ($scope.env=='ZEO'? 'PRO2':'PRO3'))
                                var url = "http://g4w1128.houston.hp.com/dialadmin/" + env + "/dialMonitor.aspx?mode=Tasks&batch_id=" + this.point.bid
                               return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>Batch ID: <a href="'+ url +'" target="_blank">'+this.point.bid+'</a></b><br/><b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high);                       
                            }
                            }
                    },

                    plotOptions: {
                        series: {
                        grouping: true,
                        pointWidth: 25,
                        borderWidth: 1,
                        events: {
                                        click: function (e) {
                                          //  var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                             
                                           // window.location.href = "#/performanceDetail/"+date+"/"+$scope.env;                                    
                                            window.location.href = "#/cpmDetail/"+$scope.env+"/"+e.point.eid+"/"+date;                                    
                                           // window.location.href = "#/cpmDetail/"+$scope.env+"/"+e.point.eid;                                    
                            
                                         }
                                    }
                                }
                    },

                    legend: {
                        enabled: false
                    },

                    series: [{
                        name: 'Start-End',
                        
                        data: [],
                    zoneAxis: 'x',
                
                    }]
            }
            var i;
            for( i = 0; i < data.data.length; i++){

                $scope.cpm.series[0].data[i] = {
                        low: Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
                        high: Date.parse(data.data[i].LOCAL_END_TS+" UTC"),
                        per:data.data[i].PERCENTAGE,
                        bid:data.data[i].BATCHID,
                        eid:data.data[i].EVENTID,
                        x: 1
                    }

                if (data.data[i].BATCHID == null){
                    $scope.cpm.series[0].data[i].color = '#c2d6d6'
                }else if (data.data[i].PERCENTAGE > 90 ){
                    $scope.cpm.series[0].data[i].color = '#E6005C'
                } else if (data.data[i].PERCENTAGE > 60){
                   $scope.cpm.series[0].data[i].color = '#E6E600'

                } else{
                    $scope.cpm.series[0].data[i].color =  '#90ed7d'
                }  
            }


            if(data.LongRunning != null) {
                var j=0;
                $scope.cpm.series[1] = {
                    name: 'Long Running Jobs',
                    borderWidth: 2,
                    pointWidth: 15,
                                data: []
                 }
              
                for(j=0;j<data.LongRunning.length;j++){
                    $scope.cpm.series[1].data[j] = {
                          low: Date.parse(data.LongRunning[j].LOCAL_START_TS+" UTC"),
                          high: Date.parse(data.LongRunning[j].LOCAL_END_TS+" UTC"),
                          bid:data.LongRunning[j].BATCHID,
                          eid:data.LongRunning[j].EVENTID,
                          x: data.LongRunning[j].x,
                    }

                    if (data.LongRunning[j].onCPM == 1){
        
                        if(data.LongRunning[j].DURATION - data.LongRunning[j].THRIY_DAYS_AVG > 60  ){
                            $scope.cpm.series[1].data[j].color = 'rgba(255, 0, 0, 0.7)'
                         }else if (data.LongRunning[j].DURATION - data.LongRunning[j].THRIY_DAYS_AVG > 30){
                            $scope.cpm.series[1].data[j].color = 'rgba(255, 128, 0, 1)'
                        }else{
                            $scope.cpm.series[1].data[j].color = 'rgba(255, 255, 0, 0.7)'
                           
                        }

                    }else{
                        $scope.cpm.series[1].data[j].color = "rgba(185,184,187, .7)"
                    }      
              }
                $scope.height = 400 + (-1 - data.LongRunningMaxKey)*100
                if ( $scope.height < 400){
                $scope.height = 400
                }

            }else{
                 $scope.height = 400
            }
}

function drawCriticalPathByTimeChart($scope){

    var date = getFormatDate($scope.dt); 
    var data = $scope.data;
    var i = 0;
    var seriesdata = []
    var seriesdata2 = []
    $scope.height = 400
    for(i=0;i<data.data.length;i++){
      seriesdata[i] = {
      x:Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
      y:data.data[i].OVERALLPERCENTAGE,
      start: Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
      end: Date.parse(data.data[i].LOCAL_END_TS+" UTC"),
      per:data.data[i].PERCENTAGE,
      bid:data.data[i].BATCHID,
      eid:data.data[i].EVENTID,
      radius: 3,
        marker: {
                    enabled: true,      
                    lineWidth: 1,
                 
                        states:{
                            hover: {  
                                          enabled: true,  
                                          radius: 3,
                                          lineWidth: 0,
                                          fillColor:'#90ed7d' , 
                                          lineColor:'#90ed7d'                            
                                      } 
                        }
                }

             }

     if(data.data[i].OVERALLPERCENTAGE > 42){
        seriesdata[i].marker.states.hover.fillColor = '#E6005C'
        seriesdata[i].color = '#E6005C'
     
     }else{
        seriesdata[i].marker.states.hover.fillColor = '#90ed7d'
        seriesdata[i].color = '#90ed7d'
     
     }

     if(data.data[i].BATCHID == null){
        seriesdata[i].marker.states.hover.fillColor = '#c2d6d6'
         seriesdata[i].marker.fillColor = '#c2d6d6'
        seriesdata[i].color = '#c2d6d6'
        break;
     }

    }
     var currenti = i;
     for(i=i;i<data.data.length;i++){
      seriesdata2[i-currenti] = {
      x:Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
      y:data.data[i].OVERALLPERCENTAGE,
      start: Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
      end: Date.parse(data.data[i].LOCAL_END_TS+" UTC"),
      per:data.data[i].PERCENTAGE,
      bid:data.data[i].BATCHID,
      eid:data.data[i].EVENTID,
      color: '#c2d6d6',
      radius: 3,
      marker: {
                    enabled: true,      
                    lineWidth: 1,
                        states:{
                            hover: {  
                                          enabled: true,  
                                          radius: 3,
                                          lineWidth: 0,
                                          fillColor:'#c2d6d6' , 
                                          lineColor:'#c2d6d6'                            
                                      } 
                        }
                }

             }
     }
    
    $scope.cpm = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Critical Path Chart - Overall View'
        },
         subtitle: {
                        text: 'Observed for '+ $scope.env + ' - ' + date
                    },
          xAxis: {
          type:'datetime',
            title: {
                            text: 'TIME ( Local )'
                        }
        },
       credits:{
       enabled: false
       },
       legend:{
       enabled: false
       },
        yAxis: [
        { 
            
            min:data.overallmin,
            max:data.overallmax,
            labels: {
                        enabled: false,
                format: '{value} %'
            },
           title: {
                text: 'Normalization Rate(%)'
            },
             plotLines: [{
                    value: 42,
                    color: 'green',
                    dashStyle: 'shortdash',
                    width: 2
                }]
        }
        ],
         tooltip: {
            useHTML: true,
            formatter: function () {
                            if(this.point.bid == null){
                                return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>Overall Percentage:</b>'+this.point.y+'<br/><b>EstimateStartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.start)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.end); 
                             }
                            else{
                                var env = $scope.env=='ITG'? 'ITG1':($scope.env=='EMR'? 'PRO1' : ($scope.env=='ZEO'? 'PRO2':'PRO3'))
                                var url = "http://g4w1128.houston.hp.com/dialadmin/" + env + "/dialMonitor.aspx?mode=Tasks&batch_id=" + this.point.bid
                               return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>Overall Percentage:</b>'+this.point.y+'<br/><b>Batch ID: <a href="'+ url +'" target="_blank">'+this.point.bid+'</a></b><br/><b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.start)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.end);                       
                            }
                            }
            },
    series: [ 
        {
       name: 'MID',
           type: 'spline',
         data: seriesdata,

         lineWidth: 1,
         zones: [{                          
                value: 42,
                color: '#90ed7d' ,
            }, {
                color: '#E6005C'
            }], 
       },
           {
       name: 'MID',
           type: 'spline',
           lineWidth: 1,
       data: seriesdata2 
       }
    ],
      plotOptions: {
        spline: {
            marker: {
            enabled: true,
                lineWidth: 1,
            }
        },series: {
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 1
                    }
                },
                        events: {
                                        click: function (e) {                                 
                                            window.location.href = "#/cpmDetail/"+$scope.env+"/"+e.point.eid+"/"+date;                                    
                                         }
                                    }
            }
    },
    }
}

function drawCriticalPathByPortfolioChart($scope){
    var date = getFormatDate($scope.dt); 
    var data = $scope.data
    $scope.height = 400
    var category= []
    for(var i=0;i<data.longportfoliocategory.length;i++){
    category.push(data.longportfoliocategory[i])
    }
    category.push(" ")
    for(var i=0;i<data.portfoliocategory.length;i++){
    category.push(data.portfoliocategory[i])
    }

    var seriesdata = []
    var seriesdata2 = []
    for( var i = 0; i < data.data.length; i++){
            seriesdata[i] = {
                    low: Date.parse(data.data[i].LOCAL_START_TS+" UTC"),
                    high: Date.parse(data.data[i].LOCAL_END_TS+" UTC"),
                    per:data.data[i].PERCENTAGE,
                    bid:data.data[i].BATCHID,
                    eid:data.data[i].EVENTID,
                    x: data.data[i].PORTFOLIO+ data.longportfoliocategory.length+1
                }

            if (data.data[i].BATCHID == null){
                seriesdata[i].color = '#c2d6d6'
            }else if (data.data[i].PERCENTAGE > 90 ){
                seriesdata[i].color = '#E6005C'
            } else if (data.data[i].PERCENTAGE > 60){
               seriesdata[i].color = '#E6E600'
            } else{
               seriesdata[i].color =  '#90ed7d'
            }  
    }

    if(data.LongRunning != null) {   
            for(var j=0;j<data.LongRunning.length;j++){
                seriesdata2[j] = {
                      low: Date.parse(data.LongRunning[j].LOCAL_START_TS+" UTC"),
                      high: Date.parse(data.LongRunning[j].LOCAL_END_TS+" UTC"),
                      bid:data.LongRunning[j].BATCHID,
                      eid:data.LongRunning[j].EVENTID,
                      x: data.LongRunning[j].PORTFOLIO,
                }

                if (data.LongRunning[j].onCPM == 1){
    
                    if(data.LongRunning[j].DURATION - data.LongRunning[j].THRIY_DAYS_AVG > 60  ){
                        seriesdata2[j].color = 'rgba(255, 0, 0, 0.7)'
                     }else if (data.LongRunning[j].DURATION - data.LongRunning[j].THRIY_DAYS_AVG > 30){
                        seriesdata2[j].color = 'rgba(255, 128, 0, 1)'
                    }else{
                        seriesdata2[j].color = 'rgba(255, 255, 0, 0.7)'                                         }
                }else{
                    seriesdata2[j].color = "rgba(185,184,187, .7)"
                }      
          }
            $scope.height = 400 + (data.longportfoliocategory.length)*40
                if ( $scope.height < 400){
                $scope.height = 400
            }

    }else{
         $scope.height = 400
    }

    $scope.cpm = {            
            chart: {
                type: 'columnrange',
                inverted: true,
            },
            credits:{enabled:false},
            title: {
                text: 'Critical Path Chart by Portfolio'
            },

            subtitle: {
                text: 'Observed for '+ $scope.env + ' - ' + date
            },
            xAxis: {
                reversed: false,
                categories: category,
                labels: {
                    enabled:true,
                    style: {
                        color: "rgba(0, 0, 51, .7)"
                   },
                 
                },plotLines: [{ // mark the weekend
                                color: '#FF6600',
                                width: 2,
                                value: data.longportfoliocategory.length,
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Above Critical Path",
                                    verticalAlign: 'middle', 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            },{ // mark the weekend
                                color: '#FF6600',
                                width: 2,
                                value: data.longportfoliocategory.length,
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Below Long Running Jobs",
                                    verticalAlign: 'middle',
                                    y: +15, 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            }],
               title: {
                    text: 'Critical Path ',
                    style: {
                        color: "rgba(0, 0, 51, .7)"
                    }
                }
                },

            yAxis: {
                type: 'datetime',
                title: {
                    text: 'TIME ( Local )'
                }
            },

            tooltip: {            
            positioner: function(boxWidth, boxHeight, point) {
                var x,y;

                if (point.plotX < 200){
                    x = point.plotX + 20
                }else{
                    x =  point.plotX -130
                }

                 if (point.plotY < 150){
                    y =  point.plotY + 120
                 }else{
                    y =  point.plotY - 40
                 }

                 return {
                    x:x,
                    y:y

                 }
                
            },
                  useHTML: true,
                        formatter: function () {
                            if (this.point.per == null){
                                var env = $scope.env=='ITG'? 'ITG1':($scope.env=='EMR'? 'PRO1' : ($scope.env=='ZEO'? 'PRO2':'PRO3'))
                                var url = "http://g4w1128.houston.hp.com/dialadmin/" + env + "/dialMonitor.aspx?mode=Tasks&batch_id=" + this.point.bid

                                return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Batch ID: <a href="'+ url +'" target="_blank">'+this.point.bid+'</a><br/><b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); 
                             }
                           else if(this.point.bid == null){
                                return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>EstimateStartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); 
                             }
                            else{
                                var env = $scope.env=='ITG'? 'ITG1':($scope.env=='EMR'? 'PRO1' : ($scope.env=='ZEO'? 'PRO2':'PRO3'))
                                var url = "http://g4w1128.houston.hp.com/dialadmin/" + env + "/dialMonitor.aspx?mode=Tasks&batch_id=" + this.point.bid
                               return '<b>Event ID:</b>'+this.point.eid+'<br/><b>Percentage:</b>'+this.point.per+'<br/><b>Batch ID: <a href="'+ url +'" target="_blank">'+this.point.bid+'</a></b><br/><b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high);                       
                            }
                            }
            },

            plotOptions: {
                series: {
                grouping: true,
                pointWidth: 25,
                borderWidth: 1,
                events: {
                                click: function (e) {
                                  //  var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                             
                                   // window.location.href = "#/performanceDetail/"+date+"/"+$scope.env;                                    
                                    window.location.href = "#/cpmDetail/"+$scope.env+"/"+e.point.eid+"/"+date;                                    
                                   // window.location.href = "#/cpmDetail/"+$scope.env+"/"+e.point.eid;                                    
                    
                                 }
                            }}
            },

            legend: {
                enabled: false
            },

            series: [{
                name: 'Start-End',
                
                data: seriesdata,
            zoneAxis: 'x',
        
            },{
            name: 'Long Running Jobs',
            borderWidth: 2,
            pointWidth: 15,
                        data: seriesdata2
                 }]
    }
}

function drawRollupAnalyticChart2($scope,$http){
    var url = baseURL+ "/ranalytic"; 
    $scope.top10Chart1  = getDefaultChart();
     $scope.top10Chart2 = getDefaultChart();

    $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel+"&Chart=2").success(function(data) {
        $scope.top10Chart1 = {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Top 10 Error Code In Each Rollup - View by ' +  $scope.radioModel
                },
                 subtitle: {
                    text: 'Observed for '+ $scope.env +' - '+ data.TOP10Chart1.date + ' (Click Pie for more detailed)'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: false
                },
                credits: { enabled:false }, 
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                tooltip: {

                    headerFormat: '',
                     
                    formatter: function () {
                        var name = getCodeNamebyId($scope.errorCodeList,this.point.name);
                        var per = Math.round(this.point.percentage*100)/100
                        var s = '<span style="color:'+this.point.color+'">'+this.point.name+' '+name
                        +':</span>'+per+'%, '+this.point.y
                

                        return s;
                    }
                    // pointFormat: '<span style="color:{point.color}">{}:</span> {point.percentage:.1f}%, {point.y}'
                 },
                series: [{
                    name: 'Error Code Type',
                    colorByPoint: true,
                    innerSize: '0%',
                    data: data.TOP10Chart1.data
                }],
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none',
                        fontStyle: 'italic'
                    },
                    activeDataLabelStyle: {
                        textDecoration: 'none',
                        fontStyle: 'italic'
                    },
                     drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 65,   
                            x: 0
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 5,
                            states: {
                                hover: {
                                    fill: 'rgba(238, 238, 224,.7)'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: 'rgba(238, 238, 224,.7)'
                                }
                            }
                        }

                        },
                    series: []
                }
        }
        var i;
        for (i=0;i<data.TOP10Chart1.drilldown.length;i++){
            $scope.top10Chart1.drilldown.series[i] = {
                innerSize: '50%',
                name: 'MID',
                id: data.TOP10Chart1.drilldown[i].id,
                data: data.TOP10Chart1.drilldown[i].data
            }
        }
         $scope.top10Chart2 = {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Top 10 Error Count In Each Rollup - View by ' +  $scope.radioModel
                },
                 subtitle: {
                    text: 'Observed for '+ $scope.env +' - '+ data.TOP10Chart2.date + ' (Click Pie for more detailed)'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: false
                },
                credits: { enabled:false }, 
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                tooltip: {

                    headerFormat: '',

                    formatter: function () {
                        var name = getCodeNamebyId($scope.errorCodeList,this.point.name);
                        var per = Math.round(this.point.percentage*100)/100
                        var s = '<span style="color:'+this.point.color+'">'+this.point.name+' '+name
                        +':</span>'+per+'%, '+this.point.y
                

                        return s;
                    }
                   //  pointFormat: '<span style="color:{point.color}">{point.name}:</span> {point.percentage:.1f}%, {point.y}'
                 },
                series: [{
                    name: 'Error Code Type',
                    colorByPoint: true,
                    innerSize: '0%',
                    data: data.TOP10Chart2.data
                }],
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none',
                        fontStyle: 'italic'
                    },
                    activeDataLabelStyle: {
                        textDecoration: 'none',
                        fontStyle: 'italic'
                    }, 
                    drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 65,   
                            x: 0
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 5,
                            states: {
                                hover: {
                                    fill: 'rgba(238, 238, 224,.7)'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: 'rgba(238, 238, 224,.7)'
                                }
                            }
                        }

                    },
                    series: []
                }
        }
        var i;
        for (i=0;i<data.TOP10Chart2.drilldown.length;i++){
            $scope.top10Chart2.drilldown.series[i] = {
                innerSize: '50%',
                name: 'MID',
                id: data.TOP10Chart2.drilldown[i].id,
                data: data.TOP10Chart2.drilldown[i].data
            }
        }
    });  
}

function drawRollupAnalyticChart3($scope,$http){
    var url = baseURL+ "/ranalytic";
    $scope.top3Chart = getDefaultChart();
    $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel1+"&Chart=3").success(function(data) {
        var data1= data.x;
        var Max1 = data.spline.data.max();
     
        var colors=['#944A63','#4A947B','#44AAD5','#53868B','#6A5ACD','#FF6A6A','#CD9B9B','#FFA500','#9370DB','#5CACEE','#90EE90','#008B8B','#EE7AE9','#E0EEEE','#CD8C95','#FFA07A','#EE9A00','#FFDAB9','#00CDCD','#8FBC8F','#BDB76B',];
        var ecd = data.ecd;

        var i=0;
        var j=0;
        var Series=[];
        for (i=0; i<3 ; i++){
            Series[i] = {
                 type: 'column',
                 name: data.column[i].name,
                 data:[]
            }
            for(j=0;j<data.column[i].value.length ;j++){
                Series[i].data[j] = {
                    name: ecd[data.column[i].value[j].x],
                    color: colors[data.column[i].value[j].x],
                    y: data.column[i].value[j].y
                }
            }
        }

        Series[3] = {
                type: 'spline',           
                name: 'Total',
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{series.color}">{series.name}:</span> <b>{point.y}</b>'
                },
                color: '#FF8247',
                data: data.spline.data, // Total count of the 3 columns.
                marker: {
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }

        Series[4] = {
                type: 'pie',
                name: 'Total Count',
                tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">{point.name}</span> :<b>{point.percentage:.1f}%</b> ,  <b>{point.y}</b>'
                    },
                data:[],
                center: [80, 50],
                size: 80,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
             }           


        for(j=0;j<data.pie.length ;j++){
            Series[4].data[j] = {
                name: ecd[data.pie[j].x],
                color: colors[data.pie[j].x],
                y: data.pie[j].y
            }
        }

        $scope.top3Chart = {
            title: {
                text: 'Rollup Error Status - Error Code (Top 3) Based - View by '+ $scope.radioModel
            },
            subtitle: {
                        text: 'Observed for '+ $scope.env
                    },
            credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                        enabled: false                 //Credits 名片   (右下角，默认为true)
                            },
            xAxis: {
                categories:data1,
            },
            labels: {
                items: [{
                    html: 'Total Error Comparison',
                    style: {
                        left: '35px',
                        top: '5px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            yAxis: {
                title: {
                    text: 'Error Count'
                },
                max: Max1 * 1.5,
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            legend: {
            enabled: false
            },
            tooltip: {
                headerFormat: '',
                  formatter: function () {
                         if(this.point.name == null){
                            return '<span style="color:'+this.point.color+'">Total:</span>'+this.point.y 
                         }
                        var name = getCodeNamebyId($scope.errorCodeList,this.point.name);

                        //var per = Math.round(this.point.percentage*100)/100
                        var s = '<span style="color:'+this.point.color+'">'+this.point.name+' '+name
                        +':</span>'+this.point.y
                

                        return s;
                    
                    }
                //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
             },
            
            series: Series
        }
    });  
}

function drawRollupAnalyticChart4($scope,$http){
    var url = baseURL+ "/ranalytic";
    $scope.systemChart  = getDefaultChart();
    $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel2+"&Chart=4&Type="+$scope.type).success(function(data) {
        var data1= data.Categories;

      var Max1 = data.Spline.max();
        
        
        var chartTitle = $scope.type == 1? "Rollup Recovery" : "System Recovery"
        $scope.systemChart = {
        //    colors: ['#944A63', '#4A947B', '#44AAD5','#FF8C00'],
            title: {
                text: chartTitle+ ' Count - View by ' + $scope.radioModel2
            },
            xAxis: {
                categories: data1
            },
            credits: { enabled:false }, 
            labels: {
                items: [{
                    html: 'Total Error comparison',
                    style: {
                        left: '35px',
                        top: '5px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}"> {series.name} </span>: <b>{point.y}</b>'
             },
           yAxis: {
                title: {
                    text: 'Count Numbers'
                },
                max: Max1 * 1.5,
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },

            series: [{
                type: 'column',
                name: 'ZEO',
                data: data.ZEO
            }, {
                type: 'column',
                name: 'JAD',
                data: data.JAD
            }, {
                type: 'column',
                name: 'EMR',
                data: data.EMR
            }, {
                type: 'spline',
                name: 'Total',
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{series.color}">{series.name}:</span> <b>{point.y}</b>'
                },
                data: data.Spline, // Total count of the 3 columns.
                marker: {
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }, {
                type: 'pie',
                name: 'Total Count',
                tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">{point.name}</span> :<b>{point.percentage:.1f}%</b> ,  <b>{point.y}</b>'
             },
                data: data.Pie,
                center: [80, 50],
                size: 80,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            }]
        }
    });     
}

function drawFileloadingChart($scope,$http){

    if ($scope.currentalphebet != null) {

        var url = baseURL + "/fileloadingone"
        $scope.FloadChart4 = getDefaultChart();
        $http.get(url + "?Company="+$scope.company+"&Character="+$scope.alphebets[$scope.currentalphebet].name).success(function(data) {
            if (data.ERROR != null){
                $scope.FloadChart4 = {
                     title: {
                        text: data.ERROR
                    },
                     credits: { enabled:false }, 
                     exporting:{ enabled:false }, 
                } 

            }else{
                var cDate = new Date();
                var time = 1800*1000;
                var date = data.date;
                var dDate = new Date(Date.parse(date + " 00:00:00 UTC"));
                var i = 0;
                var zeodata=[];
                var emrdata=[];
                var jaddata=[];
                for(i=0;i<data.ZEO.length;i++){
                    zeodata[i] = [data.ZEO[i][0],Date.parse(data.ZEO[i][1]+" UTC") - time , Date.parse(data.ZEO[i][1]+" UTC")  + time ];
                }
                 for(i=0;i<data.EMR.length;i++){
                    emrdata[i] = [data.EMR[i][0],Date.parse(data.EMR[i][1],+" UTC")  - time , Date.parse(data.EMR[i][1],+" UTC")  + time ];
                }
                 for(i=0;i<data.JAD.length;i++){
                    jaddata[i] = [data.JAD[i][0],Date.parse(data.JAD[i][1]+" UTC")  - time , Date.parse(data.JAD[i][1]+" UTC")  + time ];
                }

                $scope.FloadChart4 = {

                    chart: {
                        type: 'columnrange',
                        inverted: true
                    },

                    title: {
                        text: 'Key Source System File Generated Average Time'
                    },

                    subtitle: {
                        text: 'Date Collected From '+Highcharts.dateFormat('%Y-%m-%d',Date.parse(data.from + " 00:00:00 UTC"))+' to ' +Highcharts.dateFormat('%Y-%m-%d',Date.parse(data.to + " 00:00:00 UTC"))
                    },

                    xAxis: {
                        categories: data.categories,
                        title: {
                            text: 'Key Source System Name'
                        }
                    },
                    credits: { enabled:false }, 
                    yAxis: {
                        plotLines: [{ // mark the weekend
                        color: '#FF6600',
                        width: 1,
                        value: Date.UTC(dDate.getUTCFullYear(),dDate.getUTCMonth(),dDate.getUTCDate(),cDate.getUTCHours(),cDate.getUTCMinutes(),cDate.getUTCSeconds()),                                  
                        dashStyle:'Solid',
                        zIndex: 5,
                         label: {
                            text: "       Current Time    ",
                            verticalAlign: 'middle', 
                            style: {
                                color: '#FF6600',
                                fontWeight: 'normal'
                                }
                            }
                        }],
                        type: 'datetime',
                        min:Date.parse(date + " 00:00:00 UTC"),
                        max:Date.parse(date + " 23:59:59 UTC"),
                        tickInterval: 3600 * 1000 * 3,
                        title: {
                            text: 'Time ( UTC )'
                        },
                        
                    },

                    tooltip: {
                    followPointer: true,            
                    positioner: function(boxWidth, boxHeight, point) {
                        return {
                            x: point.plotX,
                            y: point.plotY+20
                        };
                    },
                        formatter: function () {
                    return '<b>'+ this.point.series.name+': '+ this.point.category+' -</b>'+Highcharts.dateFormat(' %H:%M',this.point.low+time); }
                        },

                    legend: {
                        enabled: true
                    },

                    series: [{
                        name: 'ZEO',
                        color:'#944A63',
                        data: zeodata
                    },{
                        name: 'EMR',
                        color:'#4A947B',
                        data: emrdata
                    },{
                        name: 'JAD',
                        color:'#44AAD5',
                        data: jaddata
                    }]

                }
            }
            
        });
    }
}

function drawLongAnalyticChart1($scope,$http){
    var url = baseURL+ "/ranalytic";
    $scope.top10Chart = getDefaultChart();
    if($scope.radioModel == 'Day'){  
        $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel+"&Chart=5").success(function(data) {
            $scope.top10Chart = {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Long Running Jobs Counts - View by ' + $scope.radioModel 
                },
                subtitle: {
                        text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                    },
                xAxis: {
                    type: 'datetime',
                    maxZoom: 6 * 24 * 3600000,  //shows 7 days
                    crosshair: false
                },
                
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Count Numbers'
                    },
                    allowDecimals: false,
                    opposite: false
                },
                tooltip: {                    //labels after moving mouse  
                },
                credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                          enabled: false
                            },
                legend: {
                    enabled: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    shadow: true
                },
                plotOptions: {
                    column: {
                        pointInterval:   1000*3600*24, // 1 day,
                        pointStart: Date.parse(data.date+" 00:00:00 UTC")  
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{            
                    name: 'Long Running Jobs',
                    step: true,
                    type: 'column',
                    data:data.data,        
                }],
            }
        });
   
    }else{
        $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel+"&Chart=5").success(function(data) {
                
                var drilldownSeries = [];
                var i=0;
                for (i=0;i<data.drilldown.length;i++){
                    drilldownSeries[i] = {
                            colorByPoint: true,
                            tooltip: {
                            headerFormat: '',
                            pointFormat: '<span style="color:{point.color}">MID Frequency: </span><b>{point.y}</b>'
                            },
                            type:'column',
                            innerSize: '50%',
                            name: 'MID',
                            id: data.drilldown[i].id,
                            data: data.drilldown[i].data,
                        }
                }

                $scope.top10Chart = {
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'Long Running Jobs Counts - View by ' + $scope.radioModel 
                    },
                    subtitle: {
                            text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                        },
                    xAxis: {
                        type:'category',
                        crosshair: false
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Count Numbers'
                        },
                        allowDecimals: false,
                        opposite: false
                    },
                    tooltip: {                    //labels after moving mouse  
                    },
                    credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                              enabled: false
                                },
                    legend: {
                        enabled: false,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        shadow: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        
                        name: 'Long Running Jobs',
                        step: true,
                        type: 'column',
                        data:data.data,        
                    }],

                    drilldown: {
                        activeAxisLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        activeDataLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 0,   
                                x: -30
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 5,
                                states: {
                                    hover: {
                                        fill: 'rgba(238, 238, 224,.7)'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: 'rgba(238, 238, 224,.7)'
                                    }
                                }
                            }

                        },
                        series:drilldownSeries 
                    }
                }
        });
    }
}

function drawLongAnalyticChart2($scope,$http){
    var url = baseURL+ "/ranalytic";
    $scope.onCPChart  = getDefaultChart();
    if ($scope.radioModel1 == 'Day'){  
        $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel1+"&Chart=6").success(function(data) {
                var color =  ['#944A63','#4A947B','#44AAD5','#53868B','#6A5ACD','#FF6A6A','#CD9B9B','#FFA500','#9370DB','#5CACEE','#90EE90','#008B8B','#EE7AE9','#E0EEEE','#CD8C95','#FFA07A','#EE9A00','#FFDAB9','#00CDCD','#8FBC8F','#BDB76B',]; 
                var mids = data.mids;
                var x = data.x;
                var series = [] ;
                for (var i = 0 ; i < data.maximumLength; i++ ){     //0~6
                    series[i] = {
                        type: 'column',
                        data: []
                    }

                    for(var j=0 ; j<x.length;j++){    //0~2
                        if (i < data.data[j].data.length ){
                            series[i].data[j]= {
                                name: mids[data.data[j].data[i].name],
                                y: data.data[j].data[i].value,
                                color: color[data.data[j].data[i].name]
                            }
                        }else{
                            series[i].data[j]= {
                                name: null,
                                y: null
                            }
                        }
                       
                    }
                }

                $scope.onCPChart = {
                    title: {
                        text: 'Long Running Jobs on Critical Path - View by '+ $scope.radioModel1
                    },
                    subtitle:{
                        text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                    },
                    xAxis: {
                        categories:x,
                    },
                    yAxis: {
                        title: {
                            text: 'Detailed MIDs & Running Time'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>, <b>{point.y}</b> mins'
                     },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                              format: 'MID {point.name}',
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                style: {
                                    textShadow: '0 0 3px black'
                                }
                            }
                        }
                    },
                    series: series
                }
        });
    }else{
        $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel1+"&Chart=6").success(function(data) {
                
                var drilldownSeries = [];
                var i=0;
                for (i=0;i<data.drilldown.length;i++){
                    drilldownSeries[i] = {
                            colorByPoint: true,
                            tooltip: {
                            headerFormat: '',
                            pointFormat: '<span style="color:{point.color}">MID Frequency: </span><b>{point.y}</b>'
                            },
                            type:'column',
                            innerSize: '50%',
                            name: 'MID',
                            id: data.drilldown[i].id,
                            data: data.drilldown[i].data,
                        }
                }

                $scope.onCPChart = {
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'Long Running Jobs on Critical Path - View by ' + $scope.radioModel1
                    },
                    subtitle: {
                            text: 'Observed for '+ $scope.env + ' (Click Bar for more detailed)'
                        },
                    xAxis: {
                        type:'category',
                        crosshair: false
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Detailed MIDs Count'
                        },
                        allowDecimals: false,
                        opposite: false
                    },
                    tooltip: {                    //labels after moving mouse  
                    },
                    credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                              enabled: false
                                },
                    legend: {
                        enabled: false,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        shadow: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{   
                        name: 'Long Running Jobs',
                        step: true,
                        type: 'column',
                        data:data.data,        
                    }],

                    drilldown: {
                        activeAxisLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        activeDataLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 0,   
                                x: -30
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 5,
                                states: {
                                    hover: {
                                        fill: 'rgba(238, 238, 224,.7)'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: 'rgba(238, 238, 224,.7)'
                                    }
                                }
                            }

                        },
                        series:drilldownSeries 
                    }
                }
        });

    }
}

function drawBDSTicketChart1($scope,$http){ 
    var url = baseURL + "/bdsticket";
    $scope.bdschart =  getDefaultChart();
    $http.get(url+"?View="+$scope.radioModel).success(function(data) {
        var drilldownSeries = [];
        var i=0;
        for (i=0;i<data.drilldown.length;i++){
            
            
            drilldownSeries[i] = {
                    colorByPoint: true,
                    tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color}">Count: </span><b>{point.y}</b>'
                    },
                    type:'column',
                    innerSize: '50%',
                    name: 'MID',
                    id: data.drilldown[i].id,
                    data: data.drilldown[i].data,
                }
        }
        $scope.bdschart =  {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'BDS Tickets - View by ' + $scope.radioModel 
            },
             subtitle: {
                text: ' (Click Bar for more detailed)'
            },			
            xAxis: {
                type:'category',
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count Numbers'
                },
                allowDecimals: false,
                opposite: false
            },
            tooltip: {                    //labels after moving mouse  
            },
            credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                      enabled: false
                        },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                shadow: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                
                name: 'Total Count',
                step: true,
                type: 'column',
                data:data.data,        
            }],

            drilldown: {
                activeAxisLabelStyle: {
                    textDecoration: 'none',
                    fontStyle: 'italic'
                },
                activeDataLabelStyle: {
                    textDecoration: 'none',
                    fontStyle: 'italic'
                },
                drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 0,   
                            x: -30
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 5,
                            states: {
                                hover: {
                                    fill: 'rgba(238, 238, 224,.7)'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: 'rgba(238, 238, 224,.7)'
                                }
                            }
                        }

                    },
                series:drilldownSeries 
            }
        }
    });
}

function initDate($scope, date){
   
      $scope.dt = date;

      $scope.clear = function () {
        $scope.dt = null;
      };

      $scope.maxDate = new Date();

      $scope.open = function($event) {
        $scope.status.opened = true;
      };

      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.status = {
        opened: false
      };  
}



function initYearMonthDate($scope,$http,type){
    $scope.setDate = function(year, month, day) {
        $scope.dt1 = new Date(year, month, day);
        $scope.dt2 = new Date(year, month, day);
        $scope.dt3 = new Date(year, month, day);
      };

    $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
     };

      $scope.dateOptions1 = {
        formatYear: 'yy',
        startingDay: 1,
        minMode: 'month'
      };

        $scope.dateOptions2 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

    $scope.dateOptions3 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

    var url = baseURL+"/MECAvailable?Type="+type
    $http.get(url).success(function (data) {
        $scope.minDate = data.mindate;
        $scope.maxDate = new Date();
        $scope.dt1 = null;
        $scope.dt2 = new Date(Date.parse(data.mindate));
        $scope.dt3 = new Date();
        $scope.currentStartDate = data.currentStartDate;
        $scope.currentEndDate = data.currentEndDate;
        $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
        
    })

     $scope.isMonthCollapsed = true;
     $scope.isDateCollapsed = true;

    

    $scope.clickMonthFilter = function (){
        $scope.isMonthCollapsed = !$scope.isMonthCollapsed ;
        $scope.isDateCollapsed = true;
    }
    $scope.clickDateFilter = function (){
        $scope.isDateCollapsed = !$scope.isDateCollapsed ;
        $scope.isMonthCollapsed = true
    }
}

function initOnlyMecMonthDate($scope,$http,type){
    $scope.setDate = function(year, month, day) {
        $scope.dt1 = new Date(year, month, day);
      };

    $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
     };

      $scope.dateOptions1 = {
        formatYear: 'yy',
        startingDay: 1,
        minMode: 'month'
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

    if(type != 'MECSummary'){
        $scope.dt1 = new Date();
    }
    var url = baseURL+"/MECAvailable?Type="+type
    $http.get(url).success(function (data) {
        $scope.minDate = data.mindate;
        if(type == 'MECSummary'){
            $scope.maxDate = data.maxdate;
            $scope.dt1 = new Date(Date.parse(data.maxdate));
        }else{
            $scope.maxDate = new Date();
            
        }
    })
}

function initDateOfMultileDate($scope){
    $scope.setDate = function(year, month, day) {
        $scope.dt1 = new Date(year, month, day);
      };

    $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[opened] = true;
     };

      $scope.dateOptions1 = {
        formatYear: 'yy',
        startingDay: 1,
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
}

function initOnlyFromToYearMonthDate($scope){
    $scope.setDate = function(year, month, day) {
        $scope.dt2 = new Date(year, month, day);
        $scope.dt3 = new Date(year, month, day);
      };

    $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[opened] = true;
     };

     $scope.dateOptions2 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

    $scope.dateOptions3 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
}

function initOtherFromToYearMonthDate($scope){
    $scope.setDate = function(year, month, day) {
        $scope.dt4 = new Date(year, month, day);
        $scope.dt5 = new Date(year, month, day);
      };

    $scope.open = function($event,opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[opened] = true;
     };

     $scope.dateOptions4 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

    $scope.dateOptions5 = {
        formatYear: 'yy',
        startingDay: 1
       
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
}


function drawRollupMetricChart1($scope,$http){  
    var url = baseURL+ "/rollupmatic?env="+$scope.env;
    $scope.mychart1 = getDefaultChart();
    $scope.mychart2 = getDefaultChart();
    $scope.mychart3 = getDefaultChart();
    $scope.mychart4 = getDefaultChart();
    if($scope.viewType == 1){
        url = url + "&month="+getFormatMonth($scope.dt1);
    }else if ($scope.viewType == 2){
        url = url + "&from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }
    $http.get(url).success(function (data) {
        if(data.rollupRun.MEC != null){
            $scope.mychart1 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                    },
                title: {
                    text: 'MEC Rollup Run Time ' 
                },
                subtitle:{
                    text: data.rollupRun.mectitleinfo
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "MEC",
                        colorByPoint: true,
                    data: [
                    {
                        name: "Rollup Time &lt;= 8.5 hours",             //  &lt;=  means  <
                        y: data.rollupRun.MEC[0],
                        color: "rgba(102, 204, 51,0.8)"
                    }, {
                        name: "8.5 &lt; Rollup Time  &lt;= 10 hours",
                        y: data.rollupRun.MEC[1],
                        sliced: true,
                        selected: true,
                        color: "rgba(255, 204, 51, 0.8)"
                    },
                    {
                        name: "Rollup Time > 10 hours",
                        y: data.rollupRun.MEC[2],
                        color: "rgba(204, 51, 0, 0.8)"
                    }                                               ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.rollupRunMec =  data.rollupRun.MEC[0]+data.rollupRun.MEC[1]+data.rollupRun.MEC[2];
        }else{
            $scope.mychart1 = {
                title: {
                 text: 'MEC not finished for this month, Rollup Run Time Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.rollupRunMec = "";
        }
       
        if(data.rollupRun.NonMEC != null){
            $scope.mychart2 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                },
                title: {
                    text: 'Non-MEC Rollup Run Time '
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                             format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "Non-MEC",
                        colorByPoint: true,
                    data: [
                    {
                        name: "Rollup Time &lt;= 8.5 hours",             //  &lt;=  means  <
                        y: data.rollupRun.NonMEC[0],
                        color: "rgba(102, 204, 51, 0.8)"
                    }, {
                        name: "8.5 &lt; Rollup Time  &lt;= 10 hours",
                        y: data.rollupRun.NonMEC[1],
                        sliced: true,
                        selected: true,
                        color: "rgba(255, 204, 51, 0.8)"
                    },
                    {
                        name: "Rollup Time > 10 hours",
                        y: data.rollupRun.NonMEC[2],
                        color: "rgba(204, 51, 0, 0.8)"
                    }                                              
                  ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.rollupRunNonMec =  data.rollupRun.NonMEC[0]+data.rollupRun.NonMEC[1]+data.rollupRun.NonMEC[2];
        }else{
            $scope.mychart2 = {
                title: {
                 text: 'Non MEC not finished for this month, Rollup Run Time Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.rollupRunNonMec = "";
        }
   
        if(data.rollupDelay.MEC != null){
            $scope.mychart3 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                    },
                title: {
                    text: 'MEC Rollup Delay Time ' 
                },
                subtitle:{
                    text: data.rollupDelay.mectitleinfo
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                             format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "MEC",
                        colorByPoint: true,
                    data: [
                    {
                        name: "3 &lt;= Delay Time &lt; 20 mins",             //  &lt;=  means  <
                        y: data.rollupDelay.MEC[0],
                        color: "rgba(102, 204, 51, 0.8)"
                    }, {
                        name: "20 &lt;= Delay Time  &lt; 40 mins",
                        y: data.rollupDelay.MEC[1],
                        sliced: true,
                        selected: true,
                        color: "rgba(255, 204, 51, 0.8)"
                    },
                    {
                        name: "Delay Time >= 40 mins",
                        y: data.rollupDelay.MEC[2],
                        color: "rgba(204, 51, 0, 0.8)"
                    }                                               ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.rollupTotalMec = data.rollupDelay.mectotal
            $scope.rollupDelayMec =  data.rollupDelay.MEC[0]+data.rollupDelay.MEC[1]+data.rollupDelay.MEC[2];
            $scope.rollupMeetMec =  $scope.rollupTotalMec - $scope.rollupDelayMec
        }else{
            $scope.mychart3 = {
                title: {
                 text: 'MEC not finished for this month, Rollup Delay Time Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.rollupTotalMec = ""
            $scope.rollupDelayMec = ""
            $scope.rollupMeecMec = ""
        }
        
        if(data.rollupDelay.NonMEC != null){
            $scope.mychart4 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                },
                title: {
                    text: 'Non-MEC Rollup Delay Time'
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                             format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "Non-MEC",
                        colorByPoint: true,
                    data: [
                   {
                        name: "3 &lt;= Delay Time &lt; 20 mins",             //  &lt;=  means  <
                        y: data.rollupDelay.NonMEC[0],
                        color: "rgba(102, 204, 51, 0.8)"
                    }, {
                        name: "20 &lt;= Delay Time  &lt;= 40 mins",
                        y: data.rollupDelay.NonMEC[1],
                        sliced: true,
                        selected: true,
                        color: "rgba(255, 204, 51, 0.8)"
                    },
                    {
                        name: "Delay Time > 40 mins",
                        y: data.rollupDelay.NonMEC[2],
                        color: "rgba(204, 51, 0, 0.8)"
                    }                                            
                  ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.rollupTotalNonMec = data.rollupDelay.nonmectotal 
            $scope.rollupDelayNonMec =  data.rollupDelay.NonMEC[0]+data.rollupDelay.NonMEC[1]+data.rollupDelay.NonMEC[2];
            $scope.rollupMeetNonMec = $scope.rollupTotalNonMec -  $scope.rollupDelayNonMec
        }else{
            $scope.mychart4 = {
                title: {
                 text: 'Non MEC not finished for this month, Rollup Delay Time Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.rollupTotalNonMec = "";
            $scope.rollupDelayNonMec = "";
            $scope.rollupMeetNonMec = "";

        }
       
    });
}

function drawRollupMetricChart2($scope,$http){  
    var url = baseURL+ "/rollupmatic";
    $scope.mychart5 = getDefaultChart();
    $scope.mychart6 = getDefaultChart();
    $scope.mychart7 = getDefaultChart();
    $scope.mychart8 = getDefaultChart();
    if($scope.viewType == 1){
        url = url + "?month="+getFormatMonth($scope.dt1);
    }else if ($scope.viewType == 2){
        url = url + "?from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }
    $http.get(url).success(function (data) {


        $scope.minDate = new Date(Date.parse(data.mindate+"-01"));
        $scope.maxDate = new Date(Date.parse(data.maxdate+"-01"));

        if(data.ticketDuration.MEC != null){
            $scope.mychart5 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                    },
                title: {
                    text: 'MEC Ticket Duration ' 
                },
                subtitle:{
                    text: data.ticketDuration.mectitleinfo
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                             format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "MEC",
                        colorByPoint: true,
                    data: [
                    {
                        name: "Fix Time &lt; 30 mins",             //  &lt;=  means  <
                        y: data.ticketDuration.MEC[0],
                      color: "rgba(102, 204, 51, 0.8)"
                    }, 
                    {
                        name: "Fix Time >= 30 mins",
                        y: data.ticketDuration.MEC[1],
                          color: "rgba(204, 51, 0, 0.8)"
                    }                                               ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.ticketDuationMec =  data.ticketDuration.MEC[0]+data.ticketDuration.MEC[1];
        }else{
            $scope.mychart5 = {
                title: {
                 text: 'MEC not finished for this month, Ticket Duration Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.ticketDuationMec = "";
        }

        if(data.ticketDuration.NonMEC != null){
            $scope.mychart6 = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits: {
                        enabled: false
                },
                title: {
                    text: 'Non-MEC Ticket Duration'
                },
                tooltip: {
                    shared : false,
                      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                             format: ' {point.y} ({point.percentage:.1f}%) ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },                            
                series: [
                    {
                    name: "Non-MEC",
                        colorByPoint: true,
                    data: [
                   {
                        name: "Fix Time &lt; 30 mins",             //  &lt;=  means  <
                        y: data.ticketDuration.NonMEC[0],
                         color: "rgba(102, 204, 51, 0.8)"
                    }, 
                    {
                        name: "Fix Time >= 30 mins",
                        y: data.ticketDuration.NonMEC[1],
                       color: "rgba(204, 51, 0, 0.8)"
                    }                                          
                  ],
                    showInLegend: true,
                    dataLabels: {
                        enabled: true
                    }
                }
                ]
            };
            $scope.ticketDuationNonMec =  data.ticketDuration.NonMEC[0]+data.ticketDuration.NonMEC[1];
        }else{
            $scope.mychart6 = {
                title: {
                 text: 'Non MEC not finished for this month, Ticket Duration Data is not ready to present!'
                },
                exporting:{enabled:false},
                credits:{enabled:false}
            }
            $scope.ticketDuationNonMec = "";
        }


        $scope.mychart7 = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket'
            },
                                    plotOptions: {
                series: {
                    borderWidth:0,
                    dataLabels: {
                        enabled: true,
                        format: ' {point.y} '      
                    }
                }
            },
            xAxis: {
                categories: [],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'number'
                }
            },
            tooltip: {
               shared: true,
               pointFormat: '{series.name}: {point.y} '
            },
            series: [{
                name: 'Ticket number',
                data: []
            }],
            credits: {
            enabled: false
            },
        };

        var i;
        for (i = 0; i < data.ticket.data.length; i++) { 
            $scope.mychart7.xAxis.categories[i] = data.ticket.data[i].x;
            $scope.mychart7.series[0].data[i] = data.ticket.data[i].y;
        }
        $scope.tickeTotal =  data.ticket.total;
        $scope.tickeAvg =  data.ticket.avg;
        $scope.mychart8 = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: {
                    enabled: false
            },
            title: {
                text: 'Need SME Help'
            },
            tooltip: {
                shared : false,
                  pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%) '     
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                         format: ' {point.y} ({point.percentage:.1f}%) ',      
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },                            
            series: [
                {
                name: "Need SME Help",
                    colorByPoint: true,
                data: [
               {
                    name: "No",             //  &lt;=  means  <
                    y: data.help.NO,
                    color: "rgba(102, 204, 51, 0.8)"
                }, 
                {
                    name: "Yes",
                    y: data.help.YES,
                    color: "rgba(204, 51, 0, 0.8)"
                }                                          
              ],
                showInLegend: true,
                dataLabels: {
                    enabled: true
                }
            }
            ]
        };
        $scope.tickeHelpTotal =  data.help.YES+ data.help.NO;
        ajaxindicatorstop(); 
    });
}

function drawLongAnalyticTable($scope,$http){
    var url = baseURL+ "/ranalytic";
     $http.get(url+"?Environment="+$scope.env+"&View="+$scope.radioModel1+"&Chart=7").success(function(data) {         
            getPaginationData($scope, data.data, 150);
     })
}

function drawCMBFXChart1($scope,$http){ 
    var url = baseURL + "/cmbfx";
    $scope.bdschart =  getDefaultChart();
    $http.get(url+"?View="+$scope.radioModel).success(function(data) {
        var drilldownSeries = [];
        var i=0;
        for (i=0;i<data.drilldown.length;i++){
            
            
            drilldownSeries[i] = {
                    colorByPoint: true,
                    tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color}">Count: </span><b>{point.y}</b>'
                    },
                    type:'column',
                    innerSize: '50%',
                    name: 'MID',
                    id: data.drilldown[i].id,
                    data: data.drilldown[i].data,
                }
        }
        $scope.bdschart =  {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'CM BreakFix Tickets - View by ' + $scope.radioModel 
            },
             subtitle: {
                text: ' (Click Bar for more detailed)'
            },          
            xAxis: {
                type:'category',
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count Numbers'
                },
                allowDecimals: false,
                opposite: false
            },
            tooltip: {                    //labels after moving mouse  
            },
            credits: {                           //get rid  of the tooltip "highchart.com" on lower right corner
                      enabled: false
                        },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                shadow: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                
                name: 'Total Count',
                step: true,
                type: 'column',
                data:data.data,        
            }],

            drilldown: {
                activeAxisLabelStyle: {
                    textDecoration: 'none',
                    fontStyle: 'italic'
                },
                activeDataLabelStyle: {
                    textDecoration: 'none',
                    fontStyle: 'italic'
                },
                drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 0,   
                            x: -30
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 5,
                            states: {
                                hover: {
                                    fill: 'rgba(238, 238, 224,.7)'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: 'rgba(238, 238, 224,.7)'
                                }
                            }
                        }

                    },
                series:drilldownSeries 
            }
        }
    });
}

function drawRollupSLAStatus($scope,$http){
    var url = baseURL + "/slabreach1"
    $scope.rollupsla1 = getDefaultChart();
    $scope.rollupsla2 = getDefaultChart();

    $http.get(url+ "?Environment="+$scope.env).success(function (data) {
    //$http.get("phones/RollupSLA.json").success(function (data) {
        $scope.rollupsla1 = {
            credits: { enabled:false }, 
            title: {
                    text: 'Rollup Meet SLA Status - View by Month',       
            },
                subtitle: {
                    text: 'Observed for ' + $scope.env +' [Click for Details]',
            },
            xAxis: {
                categories: data.categories,
            },
              plotOptions: {
                    column: {
                        dataLabels: {
                            align: 'left',
                            enabled: true,
                            rotation: 315,
                            x: 0,
                            y: -10,
                            format: ' {point.y}% ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    },
                    series: {
                        events: {
                                click: function (e) {
                                       
                                        var date = getDateByString(e.point.category);                                                       
                                        window.location.href = "#/slametricreason/"+$scope.env+"/"+date; 
                                      
                                       }
                            }
                    }

                }, 
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}"> {series.name} </span>: <b>{point.y}%</b>'
             },
             yAxis: [{
                labels: {
                formatter: function () {
                   if ( this.value > 100){
                    return '';
                   }else{
                    return this.value;
                   }
                 }
                },
      
                title: {
                    text: 'Percentage'
                }
            },{
                title: {
                    text: 'Rollup Durations (H)',
                    style: {
                        color: 'rgba(0, 204, 102,1)', 
                    }
                },
                opposite: true
            }]
            ,
            series: [{
                type: 'column',
                name: 'MEC',
                data: data.MEC,
                yAxis: 0
            }, {
                type: 'column',
                name: 'Non-MEC',
                data: data.NonMEC,
                 yAxis: 0
            }, {
                type: 'column',
                name: 'Total',
                data: data.Total,
                 yAxis: 0
            },{
                type: 'spline',
                name: 'Rollup Durations (H)',
                data: data.RollupTime,
                yAxis: 1,
                color: 'rgba(0, 204, 102,1)', 
                 tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}"> {series.name} </span>: <b>{point.y}</b>'
             },
            }]
        }

        if (data.lastmonthfinished == false ){
             $scope.rollupsla1.xAxis.plotBands = {
                        from: data.categories.length-1.5,
                        to: data.categories.length+1 ,       
                        color: '#e6e6e6',
                        label: {
                                text: 'Current MEC Month',
                                align: 'left',
                                rotation: 270,
                                verticalAlign: 'bottom',   
                                y: -15,
                                x:10  ,
                                 style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }       
                            }
                     }
        }
    });
    

    url = nodejsURL + "/slarollupinfo"

    $http.get(url+ "?Environment="+$scope.env).success(function (data) {
    //$http.get("phones/RollupSLA.json").success(function (data) {
        $scope.rollupsla2 = {
            credits: { enabled:false }, 
            title: {
                    text: 'Rollup Delay SLA Status - View by Month',       
            },
                subtitle: {
                    text: 'Observed for ' + $scope.env ,
            },
            xAxis: {
                categories: data.categories,
            },
              plotOptions: {
                    column: {
                        dataLabels: {
                            align: 'left',
                            enabled: true,
                            rotation: 315,
                            x: 0,
                            y: -10,
                            format: ' {point.y} ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    },

                }, 
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}"> {series.name} </span>: <b>{point.y}</b>'
             },
             yAxis: [{
                title: {
                    text: 'Count'
                }
            }]
            ,
            series: [{
                type: 'column',
                name: 'MEC',
                data: data.MEC,
                yAxis: 0
            }, {
                type: 'column',
                name: 'Non-MEC',
                data: data.NonMEC,
                 yAxis: 0
            }, {
                type: 'column',
                name: 'T-15mins',
                data: data.T15Min,
                 yAxis: 0
            }
            ]
        }

        if (data.lastmonthfinished == false ){
             $scope.rollupsla2.xAxis.plotBands = {
                        from: data.categories.length-1.5,
                        to: data.categories.length+1 ,       
                        color: '#e6e6e6',
                        label: {
                                text: 'Current MEC Month',
                                align: 'left',
                                rotation: 270,
                                verticalAlign: 'bottom',   
                                y: -15,
                                x:10  ,
                                 style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }       
                            }
                     }
        }
    });


}

function drawRollupSLAStatus2($scope,$http){
    var url = baseURL + "/slabreach2?env=" + $scope.env;
    if ($scope.viewType == 1){
        url = url + "&month="+getFormatMonth($scope.dt1)
    }else if ($scope.viewType == 2){
        url = url + "&from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }

    $scope.rollupsla2 = getDefaultChart();
    $scope.rollupsla3 = getDefaultChart();
    $http.get(url).success(function (data) {

        getPaginationData($scope, data.sladetailed, 150)

        // var mydata = {
        //     title: 'Rollup Miss SLA Status - by Workday',
        //     seriesname: 'Error Code Type',
        //     data: data.missSLA.data,
        //     drilldown: data.missSLA.drilldown
        // }
        // $scope.rollupsla2 = getPieWithDrillDown(mydata)

        var mydata = {
            title: 'Rollup Meet SLA (T-15mins) Status',
            seriesname: 'Error Code Type',
            data: data.metSLA.data,
            drilldown: data.metSLA.drilldown
        }
        $scope.rollupsla3 = getPieWithDrillDown(mydata)
        
    });
}

function getReasonPieChart(data){
    var chart = {
                    chart: {
                        type: 'pie',
                          events: {
                            drillup: function (e) {
                               $("#query").val('').change();
                            }
                        } 
                    },
                    title: {
                        text: data.title
                    },   
                    subtitle:{
                        text: data.subtitle
                    },           
                    xAxis: {
                        type: 'category'
                    },

                    legend: {
                        enabled: false
                    },
                    credits: { enabled:false }, 
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            },
                            events: {
                                click: function (e) {
                                      $("#query").val(e.point.name).change();
                                }
                            }
                        },
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                             format: ' {point.name} ({point.percentage:.1f}%, {point.y}) ',      
                                style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true
                        }
                    },
                    tooltip: {
                            useHTML:true,
                             formatter: function () {
                                    
                                    var url = 'https://ent302.sharepoint.hp.com/teams/EDW-Operation/Lists/MSA%20SLA%20Breach%20Tracker/SLA%20Breach.aspx#InplviewHash20335065-652a-4d1f-98b7-a94ea2ab937a='
                              
                                    if(this.point.data != null){

                                        if (this.point.data.length > 18){
                                            url += "FilterFields1=Rollup%255Fx0020%255FDate-FilterValues1=" + this.point.data 
                                        }else{
                                            url += "FilterField1=Rollup%255Fx0020%255FDate-FilterValue1=" + this.point.data 
                                        }

                                        if(this.point.series.options.id != null){  //this is drilldowned chart
                                            url += "-FilterField2%3DSLA%255Fx0020%255FMiss%255Fx0020%255Freason-FilterValue2=" +  this.point.series.options.id.replace(/ /gi, "%2520") + '-FilterField3=Environment-FilterValue3=' + this.point.name;
                                        }else{ //not drilldowned chart
                                            url += "-FilterField2%3DSLA%255Fx0020%255FMiss%255Fx0020%255Freason-FilterValue2=" +  this.point.name.replace(/ /gi, "%2520").replace(/-/gi,"%252D");
                                        }
                                    }
                                 
                                    var s = '<a href="'+url+'" target="_blank"><span style="color:'+this.point.color+'">\u25CF '+this.point.name +
                                              ': </span><font color="black"><b>'+ Math.round(this.point.percentage*100)/100 +'%, '+this.y+'</b></font></a><br>'; 

                                    return s
                                }
                     },
                    series: [{
                        name: data.seriesname,
                        colorByPoint: true,
                        innerSize: '0%',
                        data: data.data
                    }],
                    drilldown: {
                        activeAxisLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                        activeDataLabelStyle: {
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        },
                         drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 65,   
                                x: 0
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 5,
                                states: {
                                    hover: {
                                        fill: 'rgba(238, 238, 224,.7)'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: 'rgba(238, 238, 224,.7)'
                                    }
                                }
                            }

                            },
                        series: []
                    }
            }
        for (var i=0;i<data.drilldown.length;i++){
           chart.drilldown.series[i] = {
                innerSize: '50%',
                id: data.drilldown[i].id,
                data: []
            }

            for(var j=0 ; j< data.drilldown[i].data.length;j++){
                chart.drilldown.series[i].data[j] = {
                    name:data.drilldown[i].data[j][0],
                    y:data.drilldown[i].data[j][1],
                    data:data.data[i].data
                }
            }
        }

    return chart
}

function drawRollupSLAStatus3($scope,$http){
    // var url = baseURL + "/slabreach3?env=" + $scope.env
    // if ($scope.viewType == 1){
    //     url = url + "&month="+getFormatMonth($scope.dt1)
    // }else if ($scope.viewType == 2){
    //     url = url + "&from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    // }
    var url = baseURL + "/slabreach3?env=" + $scope.env + "&month="+$scope.mecmonth
    // $scope.slides = []
    // $scope.myInterval = 5000;
    // $scope.noWrapSlides = false;
    // $scope.active = 0;

    $scope.mecmiss = getDefaultChart()
    $scope.nonmecmiss = getDefaultChart()
    // $scope.slides[0] = {
    //  id: 0,
    //  chart: getDefaultChart()
    // }
    //  $scope.slides[1] = {
    //  id: 1,
    //  chart: getDefaultChart()
    // }
    //  $scope.slides[2] = {
    //  id: 2,
    //  chart: getDefaultChart()
    // }

    $http.get(url).success(function (data) {
        var mydata = {
            title: 'Rollup Miss SLA Status - by Reason',
            subtitle: 'View by MEC',
            seriesname: 'Reason',
            data: data.mecmissSLAReason.data,
            drilldown: data.mecmissSLAReason.mecdrilldown
        }
    
        if(data.mecmissSLAReason.data.length ==0){
            $scope.mecmiss = getDatNotReadyChart("Sorry, Data not found in our DB!");
        }else{
             $scope.mecmiss = getReasonPieChart(mydata)
        }
        // $scope.slides[0] = {
        //     id: 0,
        //     chart:  getReasonPieChart(mydata)
        // }

        mydata = {
            title: 'Rollup Miss SLA Status - by Reason',
            subtitle: 'View by Non-MEC',
            seriesname: 'Reason',
            data: data.nonmecmissSLAReason.data,
            drilldown: data.nonmecmissSLAReason.nonmecdrilldown
        }
         if(data.nonmecmissSLAReason.data.length ==0){
            $scope.nonmecmiss = getDatNotReadyChart("Sorry, Data not found in our DB!");
        }else{
            $scope.nonmecmiss = getReasonPieChart(mydata)
        }
        // $scope.slides[1] = {
        //     id: 1,
        //     chart: getReasonPieChart(mydata)
        // }

        mydata = {
            title: 'Rollup Miss SLA Status - by Reason',
            subtitle: 'View by Total',
            seriesname: 'Reason',
            data: data.totalmissSLAReason.data,
            drilldown: data.totalmissSLAReason.totaldrilldown
        }
        if(data.totalmissSLAReason.data.length ==0){
            $scope.totalmecmiss = getDatNotReadyChart("Sorry, Data not found in our DB!");
        }else{
         $scope.totalmecmiss = getReasonPieChart(mydata)
        }
        // $scope.slides[2] = {
        //     id: 2,
        //     chart: getReasonPieChart(mydata)
        // }
    });
}

function getFormatDate(date){
    var month = (date.getMonth()+1)<10? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var day =  (date.getDate())<10? "0"+(date.getDate()) : date.getDate();
    return  date.getFullYear()+ "-"+month+"-"+ day
}

function getFormatMonth(date){
    var month = (date.getMonth()+1)<10? "0"+(date.getMonth()+1) : date.getMonth()+1;
    return  date.getFullYear()+ "-"+month
}

function drawBaselineMetric($scope,$http){
    var url = baseURL+ "/meticstwo";
    if($scope.viewType == 1){
        url = url + "?month="+getFormatMonth($scope.dt1);
    }else if ($scope.viewType == 2){
        url = url + "?from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }
    $http.get(url).success(function (data) {  
        $scope.bmetric = data;
    });
}

function drawCPMDetailChart($scope, $http){
    //var url = "http://127.0.0.1:3000/cpmdetail?Server="+$scope.currentenv+"&MID="+$scope.currenteventid
    var url = baseURL + "/cpmdetail?Server="+$scope.currentenv+"&MID="+$scope.currenteventid

    if($scope.dt2 != null){
        url = url + "&from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }

    $scope.CpmDetailchart = getDefaultChart();
    $http.get(url).success(function(data) {
    
        if (data.series.data.length > 0)
        {

            $scope.CpmDetailchart = {
            chart: {
                zoomType: 'xy'
            },
            credits:{enabled:false},
            title: {
                text: "Detailed MID Information "
            },

            xAxis: [{
                type: 'datetime',
                crosshair: true,
                tickInterval: 3600 * 1000 * 24 ,    
            }],

            yAxis:[{ // Primary yAxis
                min:data.min,
                title: {
                    text: 'Row affected',
                    style: {
                        color: 'rgba(255,165,79,1)', 
                    }
                },
                opposite: true,
                labels: {
                    style: {
                        color: 'rgba(255,165,79,1)', 
                        }
                    }
            },{ // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Durations(Mins)',
                    style: {
                        color: 'rgba(92,172,238,1)',
                        }
                },
                opposite: false,
                labels: {
                    format: '{value}',
                    style: {
                        color: 'rgba(92,172,238,1)',
                        }
                    }
            }],

            labels: {
                items: [{
                    html: '* If the MIDs is on CPM : the color of this bar is red.',
                    style: {
                  //    left: '100px',
                        left: '400px',
                        top: '330px',
                        cursor: 'pointer',
                        color: '#333366',
                        fontSize: '12px'
                        }
                    }]
            },

            tooltip: {
                shared : true,  
            },
            };
 
           if (data.MTPDate != null) {

                var cDate = new Date(Date.parse(data.MTPDate+" UTC"))
                 $scope.CpmDetailchart.xAxis[0].plotLines =  [{ 
                        color: '#FF6600',
                        width: 2,
                        value: Date.UTC(cDate.getUTCFullYear(),cDate.getUTCMonth(),cDate.getUTCDate(),cDate.getUTCHours(),cDate.getUTCMinutes(),cDate.getUTCSeconds()),
                        dashStyle: 'dash',
                        zIndex: 5,
                         label: {
                            text: "       Last MTP Date   ",
                            verticalAlign: 'left', 
                            style: {
                                color: '#FF6600',
                                fontWeight: 'bold'
                            }
                        }
                    }]
                
            }   
           

            $scope.CpmDetailchart.series = [];
            var type = ["line","column"];
            var color = ["rgba(0, 245, 122,1)","rgba(92,172,238,0.6)"];
            var dashStyle = ["ShortDashDot","Solid"];
            var title = ["Row affected of today","Durations"];
            var yAxis =[0,1]   
            var i = 0 ;

            for (i = 0; i < title.length; i++) { 
                 $scope.CpmDetailchart.series[i] = {
                        type: type[i],    
                        name: title[i],
                        dashStyle: dashStyle[i],
                        yAxis:yAxis[i],
                        color: color[i],
                        borderWidth: 2,
                        data: []
                    };
            }   

            if(data.min == 0 ){
                data.min  = 1
            }

            if (data.max/data.min > 10000){
                $scope.CpmDetailchart.series[0].zones =  [{
                        value: data.min*10000,
                        color: 'rgba(0, 245, 122,1)'
                    },{
                         color: 'rgba(255,0,0,0.8)'
                    }]

                 $scope.CpmDetailchart.tooltip = {
                     shared: true,
                     formatter: function () {
                     
                        var s = this.x + '<br>';  
                        for (var i = 0 ;i< this.points.length ;i++){
                            s += '<span style="color:'+this.points[i].point.color+'">\u25CF </span>'+this.points[i].series.name +
                              ': <b>'+ this.points[i].point.rawy +'</b><br>'; 
                        }
                           
                      return s
                    } 
                }

            }
    
            for (i = 0; i < data.series.data.length; i++) { 
                      
                $scope.CpmDetailchart.series[0].data[i] = {
                y:data.series.data[i].RowAffected,
                x:Date.parse(data.series.data[i].x+" UTC"),
                rawy:data.series.data[i].RowAffected,
               }

               if (data.max/data.min > 10000 && $scope.CpmDetailchart.series[0].data[i].y/data.min > 10000){
                    $scope.CpmDetailchart.series[0].data[i].y = data.min*10000
                    $scope.CpmDetailchart.series[0].data[i].color = "rgba(255, 0, 0,0.7)"
                    $scope.CpmDetailchart.series[0].data[i].dataLabels = {
                        enabled: true,
                            rotation: 315,
                            x: 0,
                            y: -10,
                         formatter: function() {
                            return this.point.rawy
                         }
                    }

                     $scope.CpmDetailchart.series[0].data[i].states ={
                         hover: {  
                              enabled: true,  
                                radius: 2,
                               fillColor:'rgba(255,0,0,0.8)'
                            } 
                          }  
               }

               $scope.CpmDetailchart.series[1].data[i] = {
                y:data.series.data[i].Durations,
                rawy: data.series.data[i].Durations,
                x:Date.parse(data.series.data[i].x+" UTC"),
                cpm:data.series.data[i].cpm
               }
                if(data.series.data[i].cpm.match("Yes")){
                $scope.CpmDetailchart.series[1].data[i].color = 'rgba(238,99,99,.7)';
                };

                if(data.series.data[i].AVG > -1 ){
                   var gap =   data.series.data[i].Durations - data.series.data[i].AVG
                   if(gap > 60){
                        $scope.CpmDetailchart.series[1].data[i].borderColor = 'rgba(255, 0, 0, 1)'
                   }else if (gap > 30){
                        $scope.CpmDetailchart.series[1].data[i].borderColor = 'rgba(255, 128, 0, 1)'
                   }else if (gap > 15){
                        $scope.CpmDetailchart.series[1].data[i].borderColor = 'rgba(255, 255, 0, 1)'    
                   }
                }

            } 
        }else{
            $scope.CpmDetailchart = getDatNotReadyChart("Data not found for this critiria, please reset the filter!")
        }

        $scope.portfolio = data.PORTFOLIO;
        if(data.from!= null){
            $scope.dt2 = new Date(Date.parse(data.from))
            $scope.dt3 = new Date(Date.parse(data.to))
        } 
    }); 
}

function drawCurrentRollupSummary($scope, $http){
    var url = baseURL+ "/dailyrolluptime";
    var cDate = new Date();
    $scope.mycharts= getDefaultChart();
    $http.get(url).success(function (data) {  
        if(data && data.resultcode == '200'){  
            console.log(data.result.today);            
        } 
        else
        {       
                $scope.mycharts = {      
                    chart: {
                            type: 'columnrange',
                            inverted: true ,
                            zoomType: 'xy',           
                        },
                    title: {
                            text: 'Rollup Summary'
                        },

                    subtitle: {
                        text: 'Observed for '+ data.date + ' Rollup'
                    },
                    plotOptions: {
                            series: {
                                grouping: true,
                                 
                            }
                        },
                    xAxis: {
                            categories: ['ZEO', 'EMR', 'JAD'],                   
                        },  
                    yAxis: {
                            type: 'datetime',
                             tickInterval: 3600 * 1000 * 2,
                             min: Date.parse(data.date+" 22:00:00 UTC")-3600*1000*48,
                             max: Date.parse(data.date+" 05:00:00 UTC")+3600*1000*24,
                            plotBands:[],
                             plotLines: [{ 
                                color: '#FF6600',
                                width: 2,
                                value: Date.UTC(cDate.getUTCFullYear(),cDate.getUTCMonth(),cDate.getUTCDate(),cDate.getUTCHours(),cDate.getUTCMinutes(),cDate.getUTCSeconds()),
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Current Time    ",
                                    verticalAlign: 'middle', 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            }],
                            title: {
                                text: 'UTC Time'
                            }
                        }, 
                     series: [],
                    tooltip: {
                     formatter: function() {
                         if  (this.point.name.match("Running")){
                             return '<b>'+this.point.name+' (Local)</b>  <br/> <b>Start: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localStart)+'<br/> <b>ETA: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localEnd); 
                         }
                         else if  (this.point.name.match("tarted")){
                               return '<b>'+this.point.name+'</b>';
                         }
                         else {
                             return '<b>'+this.point.name+' (Local)</b> <br/> <b>Start: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localStart)+'<br/> <b>End: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localEnd);
                         } 
                        }
                    },
                     legend: {
                        enabled: false
                    },
                     credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                    enabled: false                 //Credits 名片   (右下角，默认为true)
                        }
                };
     

                var min = 60 * 1000;
                var hour = 60 * min 
                var ADay = hour*24 ;
                var rwin = 10
                var minsgap = 2


                var ZEOStart =  Date.parse(data.date+" 03:00:00 UTC") -  data.ZEODST * hour 
                var EMRStart =  Date.parse(data.date+" 03:00:00 UTC") - data.EMRDST * hour 

                var JADStart =  Date.parse(data.date+" 03:00:00 UTC") - (data.JADDST - 24) * hour

                var from = [ZEOStart - ADay, ZEOStart - ADay + rwin*hour, ZEOStart - ADay, //left plotband, right plotband,  left to right area
                            EMRStart - ADay, EMRStart - ADay + rwin*hour, EMRStart - ADay,
                            JADStart - ADay, JADStart - ADay + rwin*hour, JADStart - ADay, 
                            ZEOStart , ZEOStart  + rwin*hour, ZEOStart ,
                            EMRStart , EMRStart  + rwin*hour, EMRStart ,
                            JADStart , JADStart  + rwin*hour, JADStart ,  
                            ]
                var to =    [ZEOStart - ADay + minsgap*min, ZEOStart - ADay + rwin*hour + minsgap*min, ZEOStart - ADay + rwin*hour, //left plotband, right plotband,  left to right area
                            EMRStart - ADay + minsgap*min, EMRStart - ADay + rwin*hour + minsgap*min, EMRStart - ADay + rwin*hour,
                            JADStart - ADay + minsgap*min, JADStart - ADay + rwin*hour + minsgap*min, JADStart - ADay + rwin*hour, 
                            ZEOStart + minsgap*min, ZEOStart  + rwin*hour + minsgap*min, ZEOStart + rwin*hour,
                            EMRStart + minsgap*min, EMRStart  + rwin*hour + minsgap*min, EMRStart + rwin*hour,
                            JADStart + minsgap*min, JADStart  + rwin*hour + minsgap*min, JADStart + rwin*hour,  
                            ]
                var color = ['#944A63','#944A63','rgba(148, 74, 99, .1)',
                             '#4A947B','#4A947B','rgba(74, 148, 123, .1)',
                             '#44AAD5','#44AAD5','rgba(68, 170, 213, .1)',
                             '#944A63','#944A63','rgba(148, 74, 99, .1)',
                             '#4A947B','#4A947B','rgba(74, 148, 123, .1)',
                             '#44AAD5','#44AAD5','rgba(68, 170, 213, .1)']
                var i,j;
                for (i=0;i<from.length;i++){
                     $scope.mycharts.yAxis.plotBands[i] = {
                        from: from[i],
                        to: to[i] ,       
                        color: color[i]
                     }

                     if (i == 2 || i == 11){
                        $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'ZEO',
                            align: 'center', 
                            style: {
                                 color: '#944A63',
                                 fontWeight: 'bold'
                                 }       
                            }
                     }else if (i == 5 || i == 14){
                         $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'EMR',
                            align: 'center', 
                            style: {
                                 color: '#4A947B',
                                 fontWeight: 'bold'
                                 }       
                            }
                     }else if (i == 8 || i == 17){
                         $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'JAD',
                            align: 'center', 
                            style: {
                                color: '#44AAD5',
                                fontWeight: 'bold'
                                }       
                            }
                     }
                } 

                $scope.mycharts.series[0] = {
                    data: [],
                    pointWidth : 20,
                };
                $scope.mycharts.series[1]={
                    data : [],
                    pointWidth  :  20
                };
                $scope.mycharts.series[2]={
                    data : [],
                    pointWidth  :  40,
                    groupPadding: 0.65
                };
                 

                for (i = 0; i < data.info.length; i++) { 

                    var d = {
                        low:  Date.parse(data.info[i].data[0]+"  UTC"),
                        high:  Date.parse(data.info[i].data[1]+"  UTC"),
                        localStart:Date.parse(data.info[i].data[2]+"  UTC"),
                        localEnd: Date.parse(data.info[i].data[3]+"  UTC"),
                        color: data.info[i].color,
                        name:data.info[i].name
                    }; 

                     if(i <=2 || (i >= 9 && i <= 11)){   // ZEO
                        d.x = 0;             
                    }else if((i>= 3 && i <= 5) || (i >= 12 && i <= 14)){ //EMR
                        d.x = 1;
                    }else {            //JAD
                        d.x = 2;
                    }

                   if (data.info[i].name.match('OffIVC')) {
                        $scope.mycharts.series[0].data.push(d);  
                   }else if (data.info[i].name.match('OffFIN')) {
                        $scope.mycharts.series[1].data.push(d);
                   }else {
                        $scope.mycharts.series[2].data.push(d);
                   }

                }
        } 
    }); 
}

function drawCurrentRollupSummaryLocalTS($scope, $http){

    var url = baseURL+ "/dailyrolluptime";
    var cDate = new Date();
    $scope.mycharts = getDefaultChart();
    $http.get(url).success(function (data) {  
        if(data && data.resultcode == '200'){  
            console.log(data.result.today);            
        } 
        else
        {       
                $scope.mycharts = {      
                    chart: {
                            type: 'columnrange',
                            inverted: true ,
                            zoomType: 'xy',           
                        },
                    title: {
                            text: 'Rollup Summary'
                        },

                    subtitle: {
                        text: 'Observed for '+ data.date + ' Rollup'
                    },
                    plotOptions: {
                            series: {
                                grouping: true,
                                 
                            }
                        },
                    xAxis: {
                            categories: ['ZEO', 'EMR', 'JAD'],                   
                        },  
                    yAxis: {
                            type: 'datetime',
                             tickInterval: 3600 * 1000 * 2,
                             min: Date.parse(data.date+" 22:00:00 UTC")-3600*1000*48,
                             max: Date.parse(data.date+" 05:00:00 UTC")+3600*1000*24,
                            plotBands:[],
                             plotLines: [{ 
                                color: '#FF6600',
                                width: 2,
                                value: Date.UTC(cDate.getUTCFullYear(),cDate.getUTCMonth(),cDate.getUTCDate(),cDate.getUTCHours(),cDate.getUTCMinutes(),cDate.getUTCSeconds()),
                                dashStyle: 'dash',
                                zIndex: 5,
                                 label: {
                                    text: "       Current Time    ",
                                    verticalAlign: 'middle', 
                                    style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }
                                }
                            }],
                            title: {
                                text: 'UTC Time'
                            }
                        }, 
                     series: [],
                    tooltip: {
                     formatter: function() {
                         if (this.point.x == 1){
                            return '<b> EMR Data is not ready!</b>';
                         }else if  (this.point.name.match("Running")){
                             return '<b>'+this.point.name+' (Local)</b>  <br/> <b>Start: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localStart)+'<br/> <b>ETA: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localEnd); 
                         }
                         else if  (this.point.name.match("tarted")){
                               return '<b>'+this.point.name+'</b>';
                         }
                         else {
                             return '<b>'+this.point.name+' (Local)</b> <br/> <b>Start: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localStart)+'<br/> <b>End: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.localEnd);
                         } 
                        }
                    },
                     legend: {
                        enabled: false
                    },
                     credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                    enabled: false                 //Credits 名片   (右下角，默认为true)
                        }
                };

                var min = 60 * 1000;
                var hour = 60 * min 
                var ADay = hour*24 ;
                var rwin = 10
                var minsgap = 2

                var ZEOStart = Date.parse(data.date+" 03:00:00 UTC") - 1* hour
                var EMRStart = Date.parse(data.date+" 03:00:00 UTC") - (-6)* hour
                var JADStart = Date.parse(data.date+" 03:00:00 UTC") - (8-24)* hour 

                var from = [ZEOStart - ADay, ZEOStart - ADay + rwin*hour, ZEOStart - ADay, //left plotband, right plotband,  left to right area
                            EMRStart - ADay, EMRStart - ADay + rwin*hour, EMRStart - ADay,
                            JADStart - ADay, JADStart - ADay + rwin*hour, JADStart - ADay, 
                            ZEOStart , ZEOStart  + rwin*hour, ZEOStart ,
                            EMRStart , EMRStart  + rwin*hour, EMRStart ,
                            JADStart , JADStart  + rwin*hour, JADStart ,  
                            ]
                var to =    [ZEOStart - ADay + minsgap*min, ZEOStart - ADay + rwin*hour + minsgap*min, ZEOStart - ADay + rwin*hour, //left plotband, right plotband,  left to right area
                            EMRStart - ADay + minsgap*min, EMRStart - ADay + rwin*hour + minsgap*min, EMRStart - ADay + rwin*hour,
                            JADStart - ADay + minsgap*min, JADStart - ADay + rwin*hour + minsgap*min, JADStart - ADay + rwin*hour, 
                            ZEOStart + minsgap*min, ZEOStart  + rwin*hour + minsgap*min, ZEOStart + rwin*hour,
                            EMRStart + minsgap*min, EMRStart  + rwin*hour + minsgap*min, EMRStart + rwin*hour,
                            JADStart + minsgap*min, JADStart  + rwin*hour + minsgap*min, JADStart + rwin*hour,  
                            ]
                var color = ['#944A63','#944A63','rgba(148, 74, 99, .1)',
                             '#4A947B','#4A947B','rgba(74, 148, 123, .1)',
                             '#44AAD5','#44AAD5','rgba(68, 170, 213, .1)',
                             '#944A63','#944A63','rgba(148, 74, 99, .1)',
                             '#4A947B','#4A947B','rgba(74, 148, 123, .1)',
                             '#44AAD5','#44AAD5','rgba(68, 170, 213, .1)']
                var i,j;
                for (i=0;i<from.length;i++){
                     $scope.mycharts.yAxis.plotBands[i] = {
                        from: from[i],
                        to: to[i] ,       
                        color: color[i]
                     }

                     if (i == 2 || i == 11){
                        $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'ZEO',
                            align: 'center', 
                            style: {
                                 color: '#944A63',
                                 fontWeight: 'bold'
                                 }       
                            }
                     }else if (i == 5 || i == 14){
                         $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'EMR',
                            align: 'center', 
                            style: {
                                 color: '#4A947B',
                                 fontWeight: 'bold'
                                 }       
                            }
                     }else if (i == 8 || i == 17){
                         $scope.mycharts.yAxis.plotBands[i].label = {
                            text: 'JAD',
                            align: 'center', 
                            style: {
                                color: '#44AAD5',
                                fontWeight: 'bold'
                                }       
                            }
                     }
                } 

                $scope.mycharts.series[0] = {
                    data: [],
                    pointWidth : 20,
                };
                $scope.mycharts.series[1]={
                    data : [],
                    pointWidth  :  20
                };
                $scope.mycharts.series[2]={
                    data : [],
                    pointWidth  :  40,
                    groupPadding: 0.65
                };
                 

                for (i = 0; i < data.info.length; i++) { 

                    var d = {
                        low:  Date.parse(data.info[i].data[0]+"  UTC"),
                        high:  Date.parse(data.info[i].data[1]+"  UTC"),
                        color: data.info[i].color,
                        name:data.info[i].name
                    }; 

                     if(i <=2 || (i >= 9 && i <= 11)){   // ZEO
                        d.x = 0;
                        d.localStart = d.low + (data.ZEODST == 1? hour : 2*hour)
                        d.localEnd = d.high + (data.ZEODST == 1? hour : 2*hour)
                        
                    }else if((i>= 3 && i <= 5) || (i >= 12 && i <= 14)){ //EMR
                        d.x = 1;
                        d.localStart = d.low - (data.EMRDST == 1? 5*hour : 6*hour)
                        d.localEnd = d.high - (data.EMRDST == 1? 5*hour : 6*hour)
                    }else {            //JAD
                        d.x = 2;
                        d.localStart = d.low + 8*hour 
                        d.localEnd = d.high + 8*hour 
                    }

                   if (data.info[i].name.match('OffIVC')) {
                        $scope.mycharts.series[0].data.push(d);  
                   }else if (data.info[i].name.match('OffFIN')) {
                        $scope.mycharts.series[1].data.push(d);
                   }else {
                        $scope.mycharts.series[2].data.push(d);
                   }

                }
        } 
    }); 
}

function drawRollupByPortfolioChart($scope,$http){
    var url = baseURL + '/rollupbyportfolio'
    var date = getFormatDate($scope.dt); 
    $scope.rollupbypf = getDefaultChart();

    $http.get(url + "?Server="+ $scope.env + "&RollupDate=" + date).success(function (data){
        var seriesdata = []
        for (var i=0; i< data.categories.length ;i++){
            seriesdata[i]= {
                name:  data.categories[i],
                data: []
            }
            var  subdata = data.data[data.categories[i]];
            for(var j=0;j<subdata.length ;j++){
               
                seriesdata[i].data[j] = {
                    x: i,
                    low: Date.parse(subdata[j].START_TS + " UTC"),
                    high: Date.parse(subdata[j].END_TS + " UTC"),
                    eventid: subdata[j].EVENTID
                }
            }
        }
        
        $scope.rollupbypf = {
            chart: {
                type: 'columnrange',
                inverted: true
            },

            title: {
                text: 'Running time of Domain'
            },

            xAxis: {
                categories: data.categories
            },

            yAxis: {
                title: {
                    text: 'UTC Time'
                },
                type: 'datetime',
                //tickInterval: 3600 * 1000 * 2
            },
             plotOptions: {
                columnrange: {
                    
                    pointWidth: 15
                }
            },
            tooltip: {
            
             formatter: function () {
                var s = '<b>'+ this.x+' </b>'
                      + ' <br/> <b>EventID: </b>' + this.point.eventid
                      + ' <br/> <b>Start: </b>'+ Highcharts.dateFormat('%y/%m/%d %H:%M:%S',this.point.low)
                      + ' <br/> <b>End: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M:%S',this.point.high) ;
                 return s; 
             }
            },
            
            legend: {
                enabled: true
            },

            series: seriesdata
        }
    })
}


function drawRollupByThreePortfolioChart($scope,$http){
    var url = baseURL + "/rollupbyearlyportfolio"
    $scope.rollupbythreepf = getDefaultChart();
    $http.get(url+ "?Environment="+$scope.env1).success(function (data) {
    //$http.get("phones/rollupbyThreePortfolio.json").success(function (data) {
        $scope.rollupbythreepf = {
            credits: { enabled:false }, 
            title: {
                    text: 'Early Domain Rollup Chart',       
            },
                subtitle: {
                    text: 'Observed for ' + $scope.env1,
            },
            xAxis: {
                categories: data.categories,
            },
              plotOptions: {
                    column: {
                        dataLabels: {
                            align: 'left',
                            enabled: true,
                            rotation: 315,
                            x: 0,
                            y: -10,
                            format: ' {point.y}% ',      
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                }, 
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}"> {series.name} </span>: <b>{point.y}%</b>'
             },
             yAxis: [{
                labels: {
                formatter: function () {
                   if ( this.value > 100){
                    return '';
                   }else{
                    return this.value;
                   }
                 }
                },
      
                title: {
                    text: 'Percentage'
                }
            }]
            ,
            series: [{
                type: 'column',
                name: 'SCA',
                data: data.SCA,
                yAxis: 0
            }, {
                type: 'column',
                name: 'EXPNFIN',
                data: data.EXPNFIN,
                 yAxis: 0
            }, {
                type: 'column',
                name: 'RODATTNMT',
                data: data.RODATTNMT,
                 yAxis: 0
            }]
        }

        if (data.lastmonthfinished == false ){
             $scope.rollupbythreepf.xAxis.plotBands = {
                        from: data.categories.length-1.5,
                        to: data.categories.length+1 ,       
                        color: '#e6e6e6',
                        label: {
                                text: 'Current MEC Month',
                                align: 'left',
                                rotation: 270,
                                verticalAlign: 'bottom',   
                                y: -15,
                                x:10  ,
                                 style: {
                                        color: '#FF6600',
                                        fontWeight: 'bold'
                                    }       
                            }
                     }
        }
    });
}

myControllers.controller('OnCallErrorCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ZEO'; 
    $scope.radioModel = 'Day';
    $scope.$watch('[env,radioModel]', function() {
         drawErrorChart($scope,$http); 
    });

    $scope.viewType = 0;
    initYearMonthDate($scope,$http,"RollupMetrics");
    drawRollupMetricChart2($scope,$http);
    $scope.openLastest = function (){
        $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
        $scope.viewType = 0;
        $scope.dt1 =null;
        $scope.isDateCollapsed = true;
        $scope.isMonthCollapsed = true;
        drawRollupMetricChart2($scope,$http);
    }
    $scope.viewDate = function (){
        $scope.title =  "Data for " + getFormatDate($scope.dt2) +" to " + getFormatDate($scope.dt3);
        $scope.viewType = 2;
        drawRollupMetricChart2($scope,$http);
    }
    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            $scope.title =  "Data for " + getFormatMonth($scope.dt1);
            $scope.viewType = 1;
            drawRollupMetricChart2($scope,$http);
        }
    }); 

}]);

myControllers.controller('PerforamnceCtrl',['$scope', '$http',
function($scope,$http){  
    $scope.env = 'ZEO';    
    $scope.$watch('env', function() {
         $scope.lastRollTime = '2015-01-01 00:00:00'; 
        drawPerformanceChart($scope,$http); 
    });    
}]);

myControllers.controller('RollupErrorCtrl',['$scope', '$http',
function($scope,$http){  
    $scope.env = 'ZEO';     
    $scope.$watch('env', function() {
        drawRollupErrorChart($scope,$http,$scope.env); 
    });    
}]);


myControllers.controller('BmetricCtrl',['$scope', '$http',
function($scope,$http) {
    initYearMonthDate($scope,$http,"RollupBaseline");
    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            $scope.title =  "Data for " + getFormatMonth($scope.dt1);
            $scope.viewType = 1;
            drawBaselineMetric($scope,$http);
        }
    });
    $scope.viewType = 0;
    drawBaselineMetric($scope,$http);
    $scope.openLastest = function (){
        $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
        $scope.viewType = 0;
        $scope.dt1 =null;
        $scope.isDateCollapsed = true;
        $scope.isMonthCollapsed = true;
        drawBaselineMetric($scope,$http);
    }
    $scope.viewDate = function (){
        $scope.title =  "Data for " + getFormatDate($scope.dt2) +" to " + getFormatDate($scope.dt3);
        $scope.viewType = 2;
        drawBaselineMetric($scope,$http);
    }

}]);

myControllers.controller('FloadCtrl',['$scope', '$http',
function($scope,$http){
    var url = baseURL +  "/fileloading"; 

    $scope.FloadChart1 = getDefaultChart();
    $scope.FloadChart2 = getDefaultChart();
    $scope.FloadChart3 = getDefaultChart();


    $http.get(url).success(function(data) {

        $scope.FloadChart1 = {
            chart: {
                type: 'area',
                zoomType:'x'
            },
            title: {
                text: 'EDW File Feeding Status'
            },
            
            xAxis: {
                type: 'datetime',
               
                //maxZoom: 2 * 24 * 3600000,  //shows 2 days
                crosshair: true,
                labels: {
                    overflow: 'justify'
                },
                plotLines:[]
            },
            yAxis: {
                 min: 0,
                title: {
                    text: 'Files Count Loaded Into Rollup'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                shared  : true,          
            },
            plotOptions: {
                area: {
                    pointInterval:   1000*60, // 1 min,
                    pointStart: Date.parse(data.chart1.STARTTIME+" UTC"),    
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
           series: [{
                    name: 'ZEO',
                    color: '#944A63',
                    data: data.chart1.ZEO
                }, {
                    name: 'JAD',
                    color: '#44AAD5',
                    data:data.chart1.JAD
                }, {
                    name: 'EMR',
                    color: '#4A947B',
                    data: data.chart1.EMR
                }]
        }

        var ZEOStart = data.chart1.ZEODST == 1 ? " 02:00:00 UTC" : " 01:00:00 UTC";
        var EMRStart = data.chart1.ZEODST == 1 ? " 09:00:00 UTC" : " 08:00:00 UTC";
        var JADStart = " 19:00:00 UTC";
        var i;
        for (i=0;i<data.chart1.date.length;i++){

             $scope.FloadChart1.xAxis.plotLines[3*i] = { 
                                    color: '#944A63',
                                    width: 1,
                                    value: Date.parse(data.chart1.date[i]+ ZEOStart),
                                    dashStyle: 'solid',
                                    zIndex: 5,
                                     label: {
                                       
                                        verticalAlign: 'middle', 
                                        style: {
                                            color: '#944A63',
                                            fontWeight: 'bold'
                                        }
                                    }
                        };
             $scope.FloadChart1.xAxis.plotLines[3*i+1] = { 
                                    color: '#4A947B',
                                    width: 1,
                                    value: Date.parse(data.chart1.date[i]+ EMRStart),
                                    dashStyle: 'solid',
                                    zIndex: 5,
                                     label: {
                                       
                                        verticalAlign: 'middle', 
                                        style: {
                                            color: '#4A947B',
                                            fontWeight: 'bold'
                                        }
                                    }
                        };
             $scope.FloadChart1.xAxis.plotLines[3*i+2] = { 
                                    color: '#44AAD5',
                                    width: 1,
                                    value: Date.parse(data.chart1.date[i]+ JADStart),
                                    dashStyle: 'solid',
                                    zIndex: 5,
                                     label: {
                                       
                                        verticalAlign: 'middle', 
                                        style: {
                                            color: '#44AAD5',
                                            fontWeight: 'bold'
                                        }
                                    }
                        };               
        }
        // $scope.FloadChart2 = {
        //     chart: {
        //         type: 'bubble',
        //         plotBorderWidth: 1,
        //         zoomType: 'xy'          
        //     },
        //     colors: ['#944A63', '#4A947B', '#44AAD5'],
        //     title: {
        //         text: 'File Loading Chart - Data subject based',
        //     },
        //     xAxis: {
        //         gridLineWidth: 1,
        //         min:0,
        //         categories: data.chart2.category,
        //         },
        //     yAxis: {            
        //         gridLineWidth: 1,
        //         title: {
        //             text:'Count'
        //         }
                
        //     },
        //     plotOptions: {
        //         series: {
        //             dataLabels: {
        //                 enabled: true,
        //                 format: '{point.name}'
        //             }
        //         }
        //     },
        //      credits: { enabled:false }, 
        //     tooltip: {
        //         headerFormat: '<table>',
        //         pointFormat: '<tr><th colspan="2"><h3>Number of {series.name} {point.category}:{point.z}</h3></th></tr>' ,
        //         footerFormat: '</table>',
        //         followPointer: true
        //     },
            
        //     series: [{
        //         name:"ZEO",
        //         data: data.chart2.ZEO,
        //         sizeBy: 'area',
        //     },{
        //         name:"EMR",
        //         data: data.chart2.EMR,
        //         sizeBy: 'area',
        //     },{
        //         name:"JAD",
        //         data: data.chart2.JAD,
        //         sizeBy: 'area',
        //     }]
        // }
        // $scope.FloadChart3 = {
        //     chart: {
        //         type: 'bubble',
        //         plotBorderWidth: 1,
        //         zoomType: 'xy'          
        //     },
        //     colors: ['#944A63', '#4A947B', '#44AAD5'],
        //     title: {
        //         text: 'File Loading Chart - Requestor based',
        //     },
        //     xAxis: {
        //         gridLineWidth: 1,
        //         min:0,
        //         categories: data.chart3.category,
        //         },
        //     yAxis: {            
        //         gridLineWidth: 1,
        //         title: {
        //             text:'Count'
        //         }
                
        //     },
        //     plotOptions: {
        //         series: {
        //             dataLabels: {
        //                 enabled: true,
        //                 format: '{point.name}'
        //             }
        //         }
        //     },
        //      credits: { enabled:false }, 
        //     tooltip: {
        //         headerFormat: '<table>',
        //         pointFormat: '<tr><th colspan="2"><h3>Number of {series.name} {point.category}:{point.z}</h3></th></tr>' ,
        //         footerFormat: '</table>',
        //         followPointer: true
        //     },
            
        //     series: [{
        //         name:"ZEO",
        //         data: data.chart3.ZEO,
        //         sizeBy: 'area',
        //     },{
        //         name:"EMR",
        //         data: data.chart3.EMR,
        //         sizeBy: 'area',
        //     },{
        //         name:"JAD",
        //         data: data.chart3.JAD,
        //         sizeBy: 'area',
        //     }]
        // }
    });
    
    // drawFileloadingChart($scope,$http);
    // $scope.alphebets = [{name:"A",selected:1,loc:0},
    //             {name:"B",selected:0,loc:1},
    //             {name:"C",selected:0,loc:2},
    //             {name:"D",selected:0,loc:3},
    //             {name:"E",selected:0,loc:4},
    //             {name:"F",selected:0,loc:5},
    //             {name:"G",selected:0,loc:6},
    //             {name:"H",selected:0,loc:7},
    //             {name:"I",selected:0,loc:8},
    //             {name:"J",selected:0,loc:9},
    //             {name:"K",selected:0,loc:10},
    //             {name:"L",selected:0,loc:11},
    //             {name:"M",selected:0,loc:12},
    //             {name:"N",selected:0,loc:13},
    //             {name:"O",selected:0,loc:14},
    //             {name:"P",selected:0,loc:15},
    //             {name:"Q",selected:0,loc:16},
    //             {name:"R",selected:0,loc:17},
    //             {name:"S",selected:0,loc:18},
    //             {name:"T",selected:0,loc:19},
    //             {name:"U",selected:0,loc:20},
    //             {name:"V",selected:0,loc:21},
    //             {name:"W",selected:0,loc:22},
    //             {name:"X",selected:0,loc:23},
    //             {name:"Y",selected:0,loc:24},
    //             {name:"Z",selected:0,loc:25},
    //             {name:"SCITS",selected:0,loc:26}
    //             ];
        
    //  $scope.currentalphebet = 0; 
    // $scope.onchange = function (alphebetLoc){

    //     $scope.alphebets[alphebetLoc].selected = 1;
    //     $scope.alphebets[$scope.currentalphebet].selected = 0;
    //     $scope.currentalphebet = alphebetLoc;
    //    drawFileloadingChart($scope,$http);
    // }

    // $scope.company= 'HPE';
    // $scope.$watch('company', function() {
    //     drawFileloadingChart($scope,$http);
    // }); 

}]);

myControllers.controller('CPMCtrl',['$scope', '$http' ,'$routeParams', '$interval',
function($scope,$http,$routeParams,$interval) {

    $scope.summaryAuto = false;
    $scope.cpmAuto = false;
    if($routeParams.env != null){
        $scope.env = $routeParams.env;
        initDate($scope, new Date(Date.parse($routeParams.date)));
    }else{
        
        $scope.env = 'ZEO';
        initDate($scope, new Date());
    }
    
    $scope.viewMode = 'simple';
    $scope.isRouteLoading = true
    $scope.viewby = 'job'
    $scope.$watch('[env,dt]', function() {
        drawCriticalPathChart($scope,$http);
    });

    $scope.onclickviewby = function(type){
        $scope.viewby = type
       if($scope.viewby == 'job'){
                drawCriticalPathByJobChart($scope)
            }else if ($scope.viewby == 'time'){
                drawCriticalPathByTimeChart($scope)
            }else if ($scope.viewby == 'portfolio'){
                drawCriticalPathByPortfolioChart($scope)
        }
    }

   drawCurrentRollupSummary($scope, $http);

    $scope.intervalPromise = $interval(function(){
        if($scope.cpmAuto){
            drawCriticalPathChart($scope,$http);
        }
        if($scope.summaryAuto){
            drawCurrentRollupSummary($scope, $http);
        }    
    }, 60000);  

}]);

myControllers.controller('RAnalyticCtrl',['$scope', '$http',
function($scope,$http) {

    $scope.env = 'ZEO';
    $scope.radioModel = 'Day';
    $scope.radioModel1 = 'Day';
    $scope.radioModel2 = 'Day';
    $scope.type = 1;

    $http.get('phones/errorcode.json').success(function (data){
        $scope.errorCodeList = data;
    }); 
    $scope.$watch('[env,radioModel]', function() {
        drawRollupAnalyticChart2($scope,$http);
    }); 

    $scope.$watch('[env,radioModel1]', function() {
        drawRollupAnalyticChart3($scope,$http);
    });    
   
     $scope.$watch('[type,radioModel2]', function() {
        drawRollupAnalyticChart4($scope,$http);
    });  
}]);

myControllers.controller('LAnalyticCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ZEO';
    $scope.radioModel = 'Day';
    $scope.radioModel1 = 'Day';
     $scope.$watch('env', function() {        
        drawLongAnalyticChart1($scope,$http);
        drawLongAnalyticChart2($scope,$http);
        drawLongAnalyticTable($scope,$http);      
    });    
    $scope.$watch('radioModel', function() {   
        drawLongAnalyticChart1($scope,$http);
    }); 
    $scope.$watch('radioModel1', function() {   
        drawLongAnalyticChart2($scope,$http);
    });
}]);

myControllers.controller('BDSTicketCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.radioModel = 'Day';
    $scope.$watch('radioModel', function() {   
         drawBDSTicketChart1($scope,$http); 
    }); 
}]);

myControllers.controller('PerformanceDetailCtrl',['$scope', '$http','$routeParams',
function($scope,$http,$routeParams) {
    $scope.date=$routeParams.date;
    $scope.env=$routeParams.env;
    $scope.pDetail = [];
    $scope.getArray = []
    $scope.getArray = [["2016-01-25 00:00",1,2,3,4,5],["2016-01-25 00:10",1,2,3,4,5]];

    $scope.getHeader =  function () {return ["Time", "Memory Allocated","CPU Busy","Disk IO Total","Rows Accessed Total","Rows IUD Total"]};
    $http.get(baseURL+"/performance?RollupDate="+$scope.date+"&Environment="+$scope.env).success(function(data) {
          var type = ["areaspline","area","areaspline","area","areaspline"];
          var color = ['rgba(51, 204, 51, .6)','rgba(36, 143, 36, 1)',
          'rgba(51,204,51,1)','rgba(159, 191, 223, .9)','rgba(128,128,255,1)'];
          var xdata = data.xdata;
          var dataset = data.data;
          var dataTitle = [];
          for(var i=0;i<dataset.length;i++){
                dataset[i].type = type[i];
                dataset[i].color = color[i];
                dataTitle[i] = dataset[i].name;
          }

          
          for (var i=0;i< dataset.length;i++) {

            var pdata = []
            for (var j=0;j< xdata.length;j++){
                if(i == 0 ){
                    $scope.getArray[j] = [xdata[j]]
                }
                $scope.getArray[j].push(dataset[i].data[j])
                pdata[j] = {
                    x: Date.parse(xdata[j] + " UTC" ),
                    y:  dataset[i].data[j]
                }
            }

            $scope.pDetail[i] = 
                {
                    chart: {
                        marginLeft: 100, // Keep all charts left aligned
                        spacingTop: 10,
                        spacingBottom: 10,
                        zoomType: 'x'
                    },
                    title: {
                        text: dataset[i].name,
                        align: 'left',
                        margin: 0,
                        x: 30
                    },
                    credits: {
                        enabled: false
                    },
                    exporting:{enabled: false},
                    legend: {
                        enabled: false
                    },               
                    xAxis: {
                        crosshair: true,
                        tickInterval: 600 * 1000  ,    
                        type: 'datetime',
                        events: {
                            setExtremes: syncExtremes
                        }
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    tooltip: {
                        positioner: function () {
                            return {
                                x: this.chart.chartWidth - this.label.width, // right aligned
                                y: -1 // align to title
                            };
                        },
           
                        borderWidth: 0,
                        backgroundColor: 'none',
                        pointFormat: '{point.y}',
                        headerFormat: '',
                        shadow: false,
                        style: {
                            fontSize: '18px'
                        },
                        valueDecimals: dataset[i].valueDecimals
                    },
                    plotOptions: {
                        area: {
                            lineWidth: 2,
                            states: {
                                hover: {
                            lineWidth: 2
                               }
                            },
                            marker: {
                                enabled: false
                            },
                        },  
                        areaspline: {
                            lineWidth: 2,
                            states: {
                                hover: {
                            lineWidth: 2
                                }
                            },
                            marker: {
                                enabled: false
                                },
                            }
                        },
                    series: [{
                        data: pdata,
                        name: dataset[i].name,
                        type: dataset[i].type,
                        color: dataset[i].color,
                        fillOpacity: 0.3,
                        tooltip: {
                            valueSuffix: ' ' + dataset[i].unit
                        }

                    }]
                }
         }
          $('#container').bind('mousemove touchmove', function (e) {
                var chart,
                    point,
                    i;

               
                for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                  if(Highcharts.charts[i] != null && dataTitle.indexOf(Highcharts.charts[i].title.textStr) > -1){
                   // console.log(Highcharts.charts[i].title.textStr)
                    chart = Highcharts.charts[i];
                    e = chart.pointer.normalize(e); // Find coordinates within the chart
                    point = chart.series[0].searchPoint(e, true); // Get the hovered point
                    if (point) {
                        point.onMouseOver(); // Show the hover marker
                        chart.tooltip.refresh(point); // Show the tooltip
                        chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
                    }
                  }
                }


         });
    });


}]);


myControllers.controller('Changemanagement',['$scope', '$http',
function($scope,$http) {
    $scope.radioModel = 'Week';
    $scope.$watch('radioModel', function() {   
         drawCMBFXChart1($scope,$http); 
    }); 
}]);

myControllers.controller('cpmDetailCtrl',['$scope', '$http','$routeParams', '$sce','$q',
function($scope,$http,$routeParams,$sce,$q) {
    $scope.eventid1 = {};
    $scope.date = $routeParams.date;
    if($scope.date == null){
        $scope.showback = false
        $scope.showpanel = false
    }else{
        $scope.showback = true
        $scope.showpanel = true
       
    }
    $scope.env = $routeParams.env;
    $scope.eventid = $routeParams.eventid;
    $scope.env1 = $scope.env;
    $scope.eventid1.value = $scope.eventid
    $scope.currentenv = $scope.env;
    $scope.currenteventid = $scope.eventid
    $scope.toSearch = false; 
    initOnlyFromToYearMonthDate($scope);
    if($scope.date != null){
         drawCPMDetailChart($scope, $http);
    }else{
        $scope.dt2 = new Date()
        $scope.dt2.setMonth($scope.dt2.getMonth() - 1)
        $scope.dt3 = new Date()
    }

    var url = baseURL + "/EventIDList" 
    $http.get(url).success(function (data) {  
        $scope.eventids = data.data
     });

    function suggest_event(term) {
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 10 states that start with `term`.
        for (var i = 0; i < $scope.eventids.length && results.length < 10; i++) {
          var state = $scope.eventids[i];
          if (state.toLowerCase().indexOf(q) === 0)
            results.push({ label: state, value: state });
        }

        return results;
    }

    $scope.autocomplete_options = {
        suggest: suggest_event
      };
    $scope.search = function(){
         $scope.showpanel = true
        $scope.currentenv = $scope.env1;
        $scope.currenteventid = $scope.eventid1.value
        drawCPMDetailChart($scope, $http);
    }
}]);

myControllers.controller('HeaderController',['$scope', '$location', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
      return $location.path() == path;
    };
  }]);

// myControllers.controller('RollupSLACtrl',['$scope', '$http',
// function($scope,$http) {
//     $scope.env = 'ALL';
//     $scope.$watch('env', function() {
//         drawRollupSLAStatus($scope,$http);
//         //drawRollupSLAStatus2($scope,$http);
//         //drawRollupSLAStatus3($scope,$http);
//         drawRollupMetricChart1($scope,$http);
//     }); 

//     initYearMonthDate($scope,$http,"RollupSLA");

//     $scope.$watch('dt1', function() {
//         if($scope.dt1 !=null){ 
//             $scope.title =  "Data for " + getFormatMonth($scope.dt1);
//             $scope.viewType = 1;         
//             //drawRollupSLAStatus2($scope,$http);
//             //drawRollupSLAStatus3($scope,$http);
//             drawRollupMetricChart1($scope,$http);
//         }
//     }); 

    
//     $scope.viewType = 0;

//     //drawRollupSLAStatus2($scope,$http);
//     //drawRollupSLAStatus3($scope,$http);
//     drawRollupMetricChart1($scope,$http);

//     var url = baseURL + "/slabreach"
//     $http.get(url).success(function (data) {
//         $scope.slabreaches = data.SLABreach;
//     });

//     $scope.openLastest = function (){
//       $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
//         $scope.viewType = 0;
//         $scope.dt1 =null;
//         $scope.isDateCollapsed = true;
//         $scope.isMonthCollapsed = true;
//         //drawRollupSLAStatus2($scope,$http);
//         //drawRollupSLAStatus3($scope,$http);
//         drawRollupMetricChart1($scope,$http);
//     }
//     $scope.viewDate = function (){
//         $scope.title =  "Data for " + getFormatDate($scope.dt2) +" to " + getFormatDate($scope.dt3);
//         $scope.viewType = 2;
//         //drawRollupSLAStatus2($scope,$http);
//         //drawRollupSLAStatus3($scope,$http);
//         drawRollupMetricChart1($scope,$http);
//     }
// }]);

myControllers.controller('RollupSLACtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ALL';
    $scope.$watch('env', function() {
        drawRollupSLAStatus($scope,$http);
    }); 


}]);

myControllers.controller('RollupSLAReasonCtrl',['$scope', '$http','$routeParams',
function($scope,$http,$routeParams) {
    $scope.mecmonth=$routeParams.mecmonth;
    $scope.env=$routeParams.env;
    drawRollupSLAStatus3($scope,$http);
}]);

myControllers.controller('yottaPlatformTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/yottatrend"
    $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "Yotta Platform CR Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.CRTrend
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "Yotta Platform IM Ticket - Closed Trend";
        var color2 = ['#262626', '#666666'];
        var chart2Data = {
            categories: data.categories,
            data:data.TicketTrend
        }
       
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);
    });
}]);

myControllers.controller('seaquestPlatformTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/seaquesttrend"
    $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "Seaquest Platform IM Ticket Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.TicketTrend
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null);

        var title2 = "Seaqest Platform PDM Number Trend";
        var color2 = ['#00a3cc', '#1ad1ff'];
        var chart2Data = {
            categories: data.categories,
            data:data.PDMTrend
        }       
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null);
    });
}]);

myControllers.controller('dataQualityTrendCtrl',['$scope', '$http',
function($scope,$http) {
     var url = baseURL + "/dqtrend"
    $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
    $scope.chart3 = getDefaultChart();
    $scope.chart4 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "New IM Ticket Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.NewTicket
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "IM Ticket Backlog Trend";
        var color2 = ['#00a3cc', '#1ad1ff'];
        var chart2Data = {
            categories: data.categories,
            data:data.TicketBacklog
        }       
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

        var title3 = "Closed IM Ticket Trend";
        var color3 = ['#262626', '#666666'];
        var chart3Data = {
            categories: data.categories,
            data:data.TicketClosed
        }       
        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,null,0);

        var title4 = "Closed IM Ticket Trend by SSIT";
        var color4 = ['#666666', '#a6a6a6'];
        var chart4Data = {
            categories: data.categories,
            data:data.TicketClosedBySSIT
        }       
        $scope.chart4 = getTrendDefaultChart(title4,color4,chart4Data,null,1);
        $scope.chart4.tooltip = {
                 shared: false,
                 formatter: function () {
                    var s = '';  
                    if (this.point.series.tooltipOptions.enabled == true){
                         s = this.point.name+'<br/>'+'<span style="color:'+this.point.color+'">\u25CF </span>'+this.series.name +
                          ': <b>'+ this.point.y +'%</b>'; 
                     }else{
                        return false
                     }        
                  return s
                } 
                }

    });
}]);

myControllers.controller('uamTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/uamtrend"
        $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "IM Ticket Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.TicketTrend
        }
        var drilldowndata = {
            drillownid:[data.categories],
            drilldowncategories: [data.TicketDrilldownCategories],
            drilldowndata:[data.TicketDrilldownData]
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "CR Trend";
        var color2 = ['#00a3cc', '#1ad1ff'];
        var chart2Data = {
            categories: data.categories,
            data:data.CRTrend
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

    });
}]);

myControllers.controller('changeManagementTrend',['$scope', '$http',
function($scope,$http) {
    var url = baseURL +"/cmtrend"
        $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
        $scope.chart3 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "RFC Number Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.RFC
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "BFX Number Trend";
        var color2 = ['#00a3cc', '#1ad1ff'];
        var chart2Data = {
            categories: data.categories,
            data:data.BFX
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

        var title3 = "MTP Review Meeting Trend";
        var color3 = ['#5c00e6', '#944dff'];
        var chart3Data = {
            categories: data.categories,
            data:data.MTP
        }       
        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,null,0);

    });
}]);

myControllers.controller('DevOnCallTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/devoncalltrend"
            $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
        $scope.chart3 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "On Call Ticket Trend";
        var color1 = ['#00e6b7', '#4dffdb','#009979', '#00cca1'];
        var chart1Data = {
            categories: data.categories,
            data:data.TicketTrend
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "TTO Trend";
        var color2 = ['#00a3cc', '#1ad1ff','#006680', '#007a99'];
        var chart2Data = {
            categories: data.categories,
            data:data.TTOTrend
        }
        var MECCategory = []
        for(var i=0 ; i< data.categories.length; i++){
            MECCategory[i] = data.categories[i] + " MEC"
        }
        var NONMECCategory = []
        for(var i=0 ; i< data.categories.length; i++){
            NONMECCategory[i] = data.categories[i] + " NONMEC"
        }
        var drilldowndata = {
            drilldownid: [MECCategory,NONMECCategory],
            drilldowncategories: [data.mecttocategories,data.nonmecttocategories],
            drilldowndata:[data.mecttodrilldown,data.nonmecttodrilldown]
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,drilldowndata,0);
        $scope.chart2.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }

        $scope.chart2.chart= {
            events: {
                drilldown: function(e) {
                   this.yAxis[0].update({
                    min: 0,
                    gridLineDashStyle: 'shortdot',
                    title: {
                        text: 'Time (mins)'
                    }});
                },
                drillup: function(e) {
                    this.yAxis[0].update({
                    min: 70,
                    gridLineDashStyle: 'shortdot',
                    title: {
                        text: 'Percentage'
                    }});
                }
            }
        }

        var title3 = "TTF Trend";
        var color3 = ['#5c00e6', '#944dff','#1e004d', '#4700b3'];
        var chart3Data = {
            categories: data.categories,
            data:data.TTFTrend
        }   

        drilldowndata = {
            drilldownid: [MECCategory,NONMECCategory],
            drilldowncategories: [data.mecttfcategories,data.nonmecttfcategories],
            drilldowndata:[data.mecttfdrilldown,data.nonmecttfdrilldown],
        }

        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,drilldowndata,0);
        $scope.chart3.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }
        $scope.chart3.chart= {
            events: {
                drilldown: function(e) {
                   this.yAxis[0].update({
                    min: 0,
                    gridLineDashStyle: 'shortdot',
                    title: {
                        text: 'Time (mins)'
                    }});
                },
                drillup: function(e) {
                    this.yAxis[0].update({
                    min: 70,
                    gridLineDashStyle: 'shortdot',
                    title: {
                        text: 'Percentage'
                    }});
                }
            }
        }


    });
}]);

myControllers.controller('releaseManagementTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/releasetrend"
            $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
        $scope.chart3 = getDefaultChart();
                $scope.chart4 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "Ticket Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.Ticket
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "MTI Request Trend";
        var color2 = ['#00e6b7', '#4dffdb'];
        var chart2Data = {
            categories: data.categories,
            data:data.MITRequest
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

        var title3 = "TTO Trend";
        var color3 = ['#00a3cc', '#1ad1ff'];
        var chart3Data = {
            categories: data.categories,
            data:data.TTO
        }       
        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,null,0);
        $scope.chart3.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }

        var title4 = "TTF Trend";
        var color4 = ['#00a3cc', '#1ad1ff'];
        var chart4Data = {
            categories: data.categories,
            data:data.TTF
        }       
        $scope.chart4 = getTrendDefaultChart(title4,color4,chart4Data,null,0);
        $scope.chart4.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }
    });
}]);

myControllers.controller('edwOnBoardingTrendCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + "/onboardtrend"
            $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
        $scope.chart3 = getDefaultChart();
                $scope.chart4 = getDefaultChart();
    $scope.chart5 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "File Loading Request Trend";
        var color1 = ['#00e6b7', '#4dffdb'];
        var chart1Data = {
            categories: data.categories,
            data:data.FileRequest
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "File Processed Trend";
        var color2 = ['#00e6b7', '#4dffdb'];
        var chart2Data = {
            categories: data.categories,
            data:data.FileProcessed
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

        var title3 = "Deep Support Trend";
        var color3 = ['#5c00e6', '#944dff'];
        var chart3Data = {
            categories: data.categories,
            data:data.DeepSupport
        }       
        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,null,0);

        var title4 = "TTO Trend";
        var color4 = ['#00a3cc', '#1ad1ff'];
        var chart4Data = {
            categories: data.categories,
            data:data.TTO
        }       
        $scope.chart4 = getTrendDefaultChart(title4,color4,chart4Data,null,0);
        $scope.chart4.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }
        var title5 = "TTF Trend";
        var color5 = ['#00a3cc', '#1ad1ff'];
        var chart5Data = {
            categories: data.categories,
            data:data.TTF
        }       
        $scope.chart5 = getTrendDefaultChart(title5,color5,chart5Data,null,0);
        $scope.chart5.yAxis = {
            min: 70,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Percentage'
            },
        }
    });
}]);            

myControllers.controller('edwOptimizationTrendCtrl',['$scope', '$http',
function($scope,$http) {
    //var url = baseURL + "/edwoptimizationtrend" 
    var url = nodejsURL + "/edwoptimization"

    $scope.chart1 = getDefaultChart();
    $scope.chart2 = getDefaultChart();
    $scope.chart3 = getDefaultChart();
    $scope.chart4 = getDefaultChart();
     $scope.chart5 = getDefaultChart();
    $scope.chart6 = getDefaultChart();
    $http.get(url).success(function(data) {
        
        var title1 = "MID By Status";
        var color1 = ['#00e6b7', '#4dffdb','#009979', '#00cca1'];
        var chart1Data = {
            categories: data.categories,
            data:data.StatusTrend
        }
        $scope.chart1 = getTrendDefaultChart(title1,color1,chart1Data,null,0);

        var title2 = "MID By Change Type";
        var color2 = ['#00a3cc', '#1ad1ff','#006680', '#007a99','#000080','#00004d'];
        var chart2Data = {
            categories: data.categories,
            data:data.ChangeTypeTrend
        }
        $scope.chart2 = getTrendDefaultChart(title2,color2,chart2Data,null,0);

        var title3 = "Classification Trend";
        var color3 = ['#00e6b7', '#4dffdb'];
        var chart3Data = {
            categories: data.categories,
            data:data.classtrend
        }       
        var drilldowndata = {
            drilldownid: [data.categories],
            drilldowncategories: [data.classdilldowncategories],
            drilldowndata:[data.classdilldowndate]
        }

        $scope.chart3 = getTrendDefaultChart(title3,color3,chart3Data,drilldowndata,0);

        var title5 = "EDW OPS Permanent Fix Status Trend ";
        var color5 = ['#00e6b7', '#4dffdb'];
        var chart5Data = {
            categories: data.categories,
            data:data.PermanentTrend
        }      
        $scope.chart5 = getTrendDefaultChart(title5,color5,chart5Data,null,0);
        $scope.chart5.yAxis = {
            min: 0,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Saved Hours'
            },
        }
        var title6 = "EDW OPS Optimization Status Trend ";
        var color6 = ['#00e6b7', '#4dffdb'];
        var chart6Data = {
            categories: data.categories,
            data:data.OptimizationTrend
        }      
        $scope.chart6 = getTrendDefaultChart(title6,color6,chart6Data,null,0);
        $scope.chart6.yAxis = {
            min: 0,
            gridLineDashStyle: 'shortdot',
            title: {
                text: 'Improved Percentage'
            },
        }

    });



        url  = nodejsURL + "/edwoptimizationlongrunning"

      $http.get(url).success(function(data) {

        var title4 = "Long Running Jobs Trend ";
        var color4 = ['#00a3cc', '#1ad1ff'];
        var chart4Data = {
            drilldownid: [data.categories],
            categories: data.categories,
            data:data.longrunning
        }     
        var drilldowndata = {
            drilldownid: [data.categories],
            drilldowncategories: [data.longrunningcategories],
            drilldowndata:[data.longrunningdrilldown]
        }  
        $scope.chart4 = getTrendDefaultChart(title4,color4,chart4Data,drilldowndata,0);


       
    });
}]);    

myControllers.controller('RequestCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.emailchecked = false;
    $scope.namechecked = false;
    $scope.rollupstatus = false;
    $scope.slametrics = false;
    $scope.edwbaseline = false;
    $scope.$watch('email', function() {
        if($scope.email != ''){
            $scope.emailchecked = false;
        }

    })
    $scope.$watch('username', function() {
        if($scope.email != ''){
            $scope.namechecked = false;
        }

    })
    $scope.submit = function (){
       if($scope.email == null || $scope.email == ''){
             $scope.emailchecked = true;
       }else{
            $scope.emailchecked = false;
       }
       if($scope.username == null || $scope.username == ''){
             $scope.namechecked = true;
       }else{
            $scope.namechecked = false;
       }
       if( $scope.emailchecked == false && $scope.namechecked == false){

        var postdata = {
            email: $scope.email,
            username: $scope.username,
            description: $scope.description,
            category: {
                "1": $scope.rollupstatus,
                "2": $scope.slametrics,
                "3": $scope.edwbaseline
            }

        }
       $http.post("http://localhost:5555/users/user", postdata).success(function(data) {
        console.log(data);

        });
        // $http({
        //     method : "POST",
        //     url : "http://localhost:5555"
        // }).then(function mySucces(response) {
        //     console.log( response.data);
        // }, function myError(response) {
        //     $scope.myWelcome = response.statusText;
        // });
           
       }

    }
    $scope.searchEmail = function (){
        $http.get("phones/getUserProfile.json").success(function(data) {

            if(data.email == null){
                var myMessageBar = angular.element( document.querySelector( '#messagebar' ) );
                myMessageBar.append('<div class="alert alert-warning"><a  class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> Sorry, this email did not subscribe any category, please submit a new request.</div>');

            }else{
                $scope.email = data.email;
                $scope.username = data.username;
                if(data.category.userRollupStatus != $scope.userRollupStatus){
                    $scope.rollupstatus = data.category.userRollupStatus;
                }    
                $scope.slametrics = data.category.userSlaMetrics;
                $scope.edwbaseline = data.category.userEdwBaseline;
            }
        })
    }
}]);

myControllers.controller('RequestHandleCtrl',['$scope', '$http',
function($scope,$http) {
    $http.get("phones/AllRequests.json").success(function(data) {
        getPaginationData($scope, data.data, 100);

    })
    $scope.submit = function (){
        var postData = {
                approved: {
                requestid: []
                },
                denied: {
                requestid: []
                },
                approver: {
                name:$scope.approvename
                }
        }
       for (var i = 0; i < $scope.events.length; i++) {
            if ($scope.events[i].toApprove == true) {
               postData.approved.requestid.push($scope.events[i].requestid)
            }
        }


        console.log(postData)
    }   
}]);

myControllers.controller('MidMTIMTPCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL + '/midmtimtpinfo'
    $http.get(url).success(function(data) {
            $scope.MTI = data.releasedate.MTI
            $scope.UAT = data.releasedate.UAT
            $scope.SSL = data.releasedate.SSL
            $scope.ControlPeriod = data.releasedate.ControlPeriod
            $scope.Frozen = data.releasedate.Frozen
            $scope.MTP = data.releasedate.MTP
            getPaginationData($scope, data.midmtimtpinfo, 150)
    })  
}]);


myControllers.controller('RollupByPortfolioCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ZEO';
    $scope.env1 = 'ZEO';
    var d = new Date();
    d.setDate(d.getDate()-1);
    initDate($scope, d);
    $scope.$watch('[env,dt]', function() {
        drawRollupByPortfolioChart($scope,$http);
     });
    $scope.$watch('env1', function() {
        drawRollupByThreePortfolioChart($scope,$http);
     });
}]);


myControllers.controller('tmpChartCtrl',['$scope', '$http',
function($scope,$http) {

  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;

     $scope.slides = []
     
     $scope.charts = []
     $scope.charts[0] = getDefaultChart();

     $scope.charts[1] = getDefaultChart();

    var item = {
        id: 0,
        chart: $scope.charts[0]
    }

    $scope.slides.push(item)

    var item = {
        id: 1,
        chart: $scope.charts[1]
    }

    $scope.slides.push(item)


    }]);


function drawDQByAssigneeChart($scope, $http){
    var url = baseURL+ "/dqbyassignee";
    $scope.dataquality = getDefaultChart();
   
    if($scope.viewType == 1){
        url = url + "?month="+getFormatMonth($scope.dt1);
    }else if ($scope.viewType == 2){
        url = url + "?from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }
    $http.get(url).success(function(data) {
        var mydata = {
            title: 'DQ IM Ticket by Assignee',
            seriesname: 'Assignee',
            data: data.dqbyassignee.data,
            drilldown: data.dqbyassignee.drilldown
        }
        $scope.dataquality = getPieWithDrillDown(mydata)
    });
}
myControllers.controller('dataQualityCtrl',['$scope', '$http',
function($scope,$http) {

    initYearMonthDate($scope,$http,"DataQuality");

    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            $scope.title =  "Data for " + getFormatMonth($scope.dt1);
            $scope.viewType = 1;
            drawDQByAssigneeChart($scope,$http);
        }
    }); 
    
    $scope.viewType = 0;
    drawDQByAssigneeChart($scope,$http);

    $scope.openLastest = function (){
      $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
        $scope.viewType = 0;
        $scope.dt1 =null;
        $scope.isDateCollapsed = true;
        $scope.isMonthCollapsed = true;
        drawDQByAssigneeChart($scope,$http);
    }
    $scope.viewDate = function (){
        $scope.title =  "Data for " + getFormatDate($scope.dt2) +" to " + getFormatDate($scope.dt3);
        $scope.viewType = 2;
        drawDQByAssigneeChart($scope,$http);
    }
}]);

function drawDevOpsChart($scope,$http){
    var url = baseURL+ "/midinformation";
    $scope.dataquality = getDefaultChart();
   
    if($scope.viewType == 1){
        url = url + "?month="+getFormatMonth($scope.dt1);
    }else if ($scope.viewType == 2){
        url = url + "?from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)
    }
    $http.get(url).success(function(data) {
    //$http.get("phones/devOps.json").success(function(data) {
        getPaginationData($scope, data.detaildata, 150)

        var mydata = {
            title: 'Mids by Status',
            seriesname: 'Status',
            data: data.midbystatus.data,
            drilldown: data.midbystatus.drilldown
        }
        $scope.devopsbystatus = getPieWithDrillDown(mydata)

         mydata = {
            title: 'Mids by Change Type',
            seriesname: 'Change Type',
            data: data.midbychangetype.data,
            drilldown: data.midbychangetype.drilldown
        }
        $scope.devopsbychangetype = getPieWithDrillDown(mydata)
    });

}

myControllers.controller('DevOpsReportCtrl',['$scope', '$http',
function($scope,$http) {

    initYearMonthDate($scope,$http,"DevOpsReport");

    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            $scope.title =  "Data for " + getFormatMonth($scope.dt1);
            $scope.viewType = 1;
            drawDevOpsChart($scope,$http);
        }
    }); 
    
    $scope.viewType = 0;
    drawDevOpsChart($scope,$http);

    $scope.openLastest = function (){
      $scope.title = "Current Fiscal Month ("  + $scope.currentStartDate + " to " + $scope.currentEndDate + ")"; 
        $scope.viewType = 0;
        $scope.dt1 =null;
        $scope.isDateCollapsed = true;
        $scope.isMonthCollapsed = true;
        drawDevOpsChart($scope,$http);
    }
    $scope.viewDate = function (){
        $scope.title =  "Data for " + getFormatDate($scope.dt2) +" to " + getFormatDate($scope.dt3);
        $scope.viewType = 2;
        drawDevOpsChart($scope,$http);
    }
}]);


function getMecSummaryDate($scope,$http,type){
    var url = nodejsURL + "/rollupmecsummary?date="+getFormatMonth($scope.dt1);
        $http.get(url).success(function(data) {
        $scope.data = data
        $scope.selectIndex = data.LASTDAY
        $scope.selectenv = data.LASTENV
        if(type ==0){
             getMecSummaryDetail($scope,$http)
         }else{
            getMecSummaryEditDetail($scope,$http)
         }
       
    })
}

function getMecSummaryDetail($scope,$http){
    var datearray = $scope.data.weeks[$scope.selectIndex].t.split(" ")
    var datestr = datearray[datearray.length-1]
    var url = nodejsURL + "/rollupmecsummarydetail?date="+datestr+"&env="+$scope.selectenv
      $http.get(url).success(function(data) {
            $scope.detaildata = data
            console.log($scope.detaildata)
        })
}

function constructComments(comments){
    var rsComments = []
    if(comments.length == 1 && comments[0].c =='N/A'){
        return []
    }else{
        for(var i = 0;i< comments.length;i++){
            var  item = {id: i, name:comments[i].c}
            rsComments.push(item)
        }
    }
    return rsComments;
}

function getMecSummaryEditDetail($scope,$http){
    var url = nodejsURL + "/rollupmecsummarydetail?date="+$scope.data.weeks[$scope.selectIndex].t+"&env="+$scope.selectenv
      $http.get(url).success(function(data) {
            $scope.jadsummarys = constructComments(data.JADCOMMENT)
            $scope.zeosummarys =  constructComments(data.ZEOCOMMENT)
            $scope.emrsummarys =  constructComments(data.EMRCOMMENT)
            $scope.yottasummarys = constructComments(data.YOTTACOMMENT)
            $scope.othersummarys = constructComments(data.OTHERCOMMENT)
        })
}

myControllers.controller('mecSummaryCtrl',['$scope', '$http',
function($scope,$http) {
    initOnlyMecMonthDate($scope,$http,'MECSummary');

    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            getMecSummaryDate($scope,$http,0);
        }
    }); 

    $scope.clickitem = function (index, env){
        $scope.selectIndex = index
        $scope.selectenv = env
        getMecSummaryDetail($scope,$http)
    }

}]);

myControllers.controller('mecSummaryEditCtrl',['$scope', '$http',
function($scope,$http) {
    initOnlyMecMonthDate($scope,$http,'MECSummary');

    $scope.$watch('dt1', function() {
        if($scope.dt1 !=null){ 
            getMecSummaryDate($scope,$http,1);
        }
    }); 

    console.log($scope.emrsummarys);
    $scope.clickitem = function (index, env){
        $scope.selectIndex = index
        $scope.selectenv = env

        getMecSummaryEditDetail($scope,$http)
    }

    $scope.removeJAD = function (item){
       var index = $scope.jadsummarys.indexOf(item)
       if(index > -1){
         $scope.jadsummarys.splice(index,1);
       }
      
    }
    $scope.addJAD = function(){
        var item = {id:$scope.jadsummarys.length,name:""}
        $scope.jadsummarys.push(item);
    }

    $scope.removeZEO = function (item){
       var index = $scope.zeosummarys.indexOf(item)
       if(index > -1){
         $scope.zeosummarys.splice(index,1);
       }
      
    }
    $scope.addZEO = function(){
        var item = {id:$scope.zeosummarys.length,name:""}
        $scope.zeosummarys.push(item);
    }

    $scope.removeEMR = function (item){
       var index = $scope.emrsummarys.indexOf(item)
       if(index > -1){
         $scope.emrsummarys.splice(index,1);
       }
      
    }
    $scope.addEMR = function(){
        var item = {id:$scope.emrsummarys.length,name:""}
        $scope.emrsummarys.push(item);
    }

    $scope.removeYOTTA = function (item){
       var index = $scope.yottasummarys.indexOf(item)
       if(index > -1){
         $scope.yottasummarys.splice(index,1);
       }
      
    }
    $scope.addYOTTA = function(){
        var item = {id:$scope.yottasummarys.length,name:""}
        $scope.yottasummarys.push(item);
    }

    $scope.removeOTHER = function (item){
       var index = $scope.othersummarys.indexOf(item)
       if(index > -1){
         $scope.othersummarys.splice(index,1);
       }
      
    }
    $scope.addOTHER = function(){
        var item = {id:$scope.othersummarys.length,name:""}
        $scope.othersummarys.push(item);
    }

    $scope.save = function (){
       
        var postdata = {
            DATE:$scope.data.weeks[$scope.selectIndex].t,
            ENV: $scope.selectenv,
            JADCOMMENT:$scope.jadsummarys,
            ZEOCOMMENT:$scope.zeosummarys,
            EMRCOMMENT: $scope.emrsummarys,
            YOTTACOMMENT: $scope.yottasummarys,
            OTHERCOMMENT:$scope.othersummarys,
        }

        var url = nodejsURL + '/rollupmecsummary'
        $http.post(url, postdata).success(function(data) {
            var myMessageBar = angular.element( document.querySelector( '#messagebar' ) );
             myMessageBar.append('<div class="alert alert-success"><a  class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> The information saved successfully!</div>');
        })
        .error(function(data) {
            var myMessageBar = angular.element( document.querySelector( '#messagebar' ) );
             myMessageBar.append('<div class="alert alert-danger"><a  class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Sorry, the information unsaved. Please contact admin.</div>');
        });

       
       
    }
}]);

function drawmcdfcTrendChart($scope,$http){
    var url = nodejsURL + "/mcdfcmcdfctrend?env="+$scope.env+"&source="+$scope.selectedSource.value+"&from="+getFormatDate($scope.dt2)+"&to="+getFormatDate($scope.dt3)+"&iscritical="+($scope.critical?"1":"0")
    console.log(url)


    $http.get(url).success(function(data) {
        $scope.mcdfctrend = {
                    colors: ["#0066ff","#5900b3","#cc0000","#29a329"],
                    rangeSelector: {
                                selected: 1,
                                buttons: [
                                   
                                    {
                                        type: 'week',
                                        count: 1,
                                        text: '1w'
                                    }, 
                                    {
                                        type: 'month',
                                        count: 1,
                                        text: '1m'
                                    }, {
                                        type: 'month',
                                        count: 3,
                                        text: '3m'
                                    }, {
                                        type: 'month',
                                        count: 6,
                                        text: '6m'
                                    }, {
                                        type: 'all',
                                        text: 'All'
                                    }]
                            },
                    scrollbar: {
                        enabled:true,
                        barBackgroundColor: 'white',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: '#B6E7E7',
                        buttonBorderWidth: 0,
                        buttonArrowColor: '#B6E7E7',
                        buttonBorderRadius: 7,
                        rifleColor: '#B6E7E7',
                        trackBackgroundColor: '#B6E7E7',
                        trackBorderWidth: 1,
                        trackBorderColor: '#B6E7E7',
                        trackBorderRadius: 7
                    },
                    chart: {
                                    zoomType: 'xy'          
                                },
                    title: {
                                    text: 'MCDFC Trend charts'
                                },
                    navigator: {                        //get rid of the spline in scrollbar
                                series: {
                                   
                                  fillOpacity: 0,
                                    lineWidth: 0,
                                  
                                }
                            },
                    credits: {
                        enabled: false
                    },
                    subtitle: {
                                text: 'Observed for '+ $scope.env
                            },
                        plotOptions: {
                                    series: {
                                        pointInterval: 24 * 3600 * 1000 , // one day,
                                        events: {
                                        click: function (e) {
                                            var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                                
                                            $('#datequery').val(date).change();                                 
                                            $('#clickTrend').trigger('click');   
                                         }
                                    }
                                    },                               
                                },
                        xAxis: {
                                    type:'datetime',                           
                                },  
                        yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Count'
                                        }
                                    },
                    tooltip: {
                        headerFormat: "{point.x:%Y-%m-%d}<br>",
                         shared: true
                    },
                     
                     legend: {
                        enabled: true,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        shadow: true
                    }
        };

        var i ,j,z;
        var day,month,year;
        $scope.mcdfctrend.series = [];

        for( i = 0; i < data.length; i++){
            $scope.mcdfctrend.series[i] = {
                name: data[i].name,
                type: 'column'
            };

            $scope.mcdfctrend.series[i].data = [];
            for(j = 0; j<data[i].dataset.length; j++){
                 $scope.mcdfctrend.series[i].data[j] = {
                    x: new Date(Date.parse(data[i].dataset[j].x + " UTC")),
                    y:data[i].dataset[j].y
                };   
            }          
        }
    })
}

function drawmcdfcChart($scope,$http){
    $scope.isshow = false;
    var url = nodejsURL + "/mecdfs?env="+$scope.env1+ "&date="+getFormatDate($scope.dt1)+"&source="+$scope.selectedSource1.value+"&iscritical="+($scope.critical?"1":"0")
    console.log(url)
    $http.get(url).success(function(data) {
        var mydata = {
            title: 'MCDFC Status',
            seriesname: 'File Loading',
            data: data.data,
            drilldown: data.drilldown,
            drilldowntype: "column"
        }
        $scope.mcdfc = getPieWithDrillDown(mydata)

        $scope.mcdfc.chart = {
                        type: 'pie',
                          events: {
                            drillup: function (e) {
                              angular.element('#mydrillup').trigger('click');
                            },
                            drilldown: function (e) {
                         
                             angular.element('#my'+e.seriesOptions.id).trigger('click');
                            }
                        },
                        
                    }
        $scope.mcdfc.colors = ["#0066ff","#5900b3","#cc0000","#29a329"]

     })
}

function drawmcdfcLineTrendChart($scope,$http){

    var type = ($scope.viewtype1?"A":"") + ($scope.viewtype2?"B":"") + ($scope.viewtype3?"C":"")
    var url = nodejsURL + "/mcdfclinetrend?env="+$scope.env2+"&type=" + type + "&from="+getFormatDate($scope.dt4)+"&to="+getFormatDate($scope.dt5)+"&iscritical="+($scope.critical?"1":"0")
    console.log(url)
     $http.get(url).success(function(data) {
        $scope.mcdfclinetrend = {
                    rangeSelector: {
                                selected: 1,
                                buttons: [
                                   
                                    {
                                        type: 'week',
                                        count: 1,
                                        text: '1w'
                                    }, 
                                    {
                                        type: 'month',
                                        count: 1,
                                        text: '1m'
                                    }, {
                                        type: 'month',
                                        count: 3,
                                        text: '3m'
                                    }, {
                                        type: 'month',
                                        count: 6,
                                        text: '6m'
                                    }, {
                                        type: 'all',
                                        text: 'All'
                                    }]
                            },
                    scrollbar: {
                        enabled:true,
                        barBackgroundColor: 'white',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: '#B6E7E7',
                        buttonBorderWidth: 0,
                        buttonArrowColor: '#B6E7E7',
                        buttonBorderRadius: 7,
                        rifleColor: '#B6E7E7',
                        trackBackgroundColor: '#B6E7E7',
                        trackBorderWidth: 1,
                        trackBorderColor: '#B6E7E7',
                        trackBorderRadius: 7
                    },
                    chart: {
                                    zoomType: 'xy'          
                                },
                    title: {
                                    text: 'MCDFC Trend charts'
                                },
                    navigator: {                        //get rid of the spline in scrollbar
                                series: {
                                   
                                  fillOpacity: 0,
                                    lineWidth: 0,
                                  
                                }
                            },
                    credits: {
                        enabled: false
                    },
                    subtitle: {
                                text: 'Observed for '+ $scope.env
                            },
                        plotOptions: {
                                    series: {
                                        pointInterval: 24 * 3600 * 1000 , // one day,
                                        events: {
                                        click: function (e) {
                                            // var date = Highcharts.dateFormat('20%y-%m-%d',e.point.x);                                                                
                                            // $('#datequery').val(date).change();                                 
                                            // $('#clickTrend').trigger('click');   
                                         },

                                    }
                                    },                               
                                },
                        xAxis: {

                                    type:'datetime',                           
                                },  
                        yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Count'
                                        }
                                    },
                    tooltip: {
                        headerFormat: "{point.x:%Y-%m-%d}<br>",
                         shared: false
                    },
                     
                     legend: {
                        enabled: true,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        shadow: true
                    }
        };

        var i ,j,z;
        var day,month,year;
        $scope.mcdfclinetrend.series = [];

        for( i = 0; i < data.data.length; i++){
            $scope.mcdfclinetrend.series[i] = {
                name: data.data[i].name,
                type: 'line',
                marker: {
                    enabled: true,
                    symbol:"circle"
                }
            };

            $scope.mcdfclinetrend.series[i].data = [];
            for(j = 0; j<data.data[i].dataset.length; j++){
                 $scope.mcdfclinetrend.series[i].data[j] = {
                    x: new Date(Date.parse(data.datetime[j] + " 00:00:00 UTC")),
                    y:data.data[i].dataset[j]
                };   
            }          
        }
     })
}

myControllers.controller('mcdfcCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ALL';
    $scope.env1 = 'ALL';
    $scope.env2 = 'ALL';

    $scope.viewtype1 = true;
    $scope.viewtype2 = true;
    $scope.viewtype3 = true;

    initOnlyFromToYearMonthDate($scope);
    var today =  new Date()
    var yesterday  = new Date(today.getTime());
    var oneweekago = new Date(today.getTime());
    yesterday.setDate(today.getDate() - 1);
    oneweekago.setDate(today.getDate() - 14);

    initDateOfMultileDate($scope);
    initOtherFromToYearMonthDate($scope)
    $scope.dt1 = yesterday
    $scope.dt2 = oneweekago
    $scope.dt3 = yesterday
    $scope.dt4 = oneweekago
    $scope.dt5 = yesterday
    $scope.selectAll = true
    $scope.critical = false;

    $http.get("phones/sourcesystemlist.json").success(function(data) {         
        $scope.sourcesystems = data
        })

    $scope.selectedSource = {"value":"ALL","id":1}
    $scope.selectedSource1 = {"value":"ALL","id":1}

    drawmcdfcLineTrendChart($scope, $http);
    drawmcdfcTrendChart($scope, $http);
    drawmcdfcChart($scope,$http);


    $scope.criticalButtonClick = function (){
         $scope.critical = !$scope.critical
        $scope.viewLineTrend();
        $scope.viewTrend();
        $scope.viewmcdfcbyday();
       
    }
    

    $scope.toselectAll = function (){

        var chart = angular.element("#linetrendchart").highcharts();

        if ($scope.selectAll){
            $(chart.series).each(function(){
            //this.hide();
            this.setVisible(false, false);
            });
            chart.redraw(); 
        }else{
             $(chart.series).each(function(){
            //this.hide();
            this.setVisible(true, false);
            });
            chart.redraw(); 
        }
        $scope.selectAll = !$scope.selectAll
    }

    $scope.viewTrend = function (){
        if($scope.dt2<= $scope.dt3){
                drawmcdfcTrendChart($scope, $http);
        }
    }

    $scope.viewmcdfcbyday = function (){
        drawmcdfcChart($scope,$http);
    }

    $scope.clickTrend = function (){

        $scope.env1 = $scope.env
        $scope.selectedSource1 = $scope.selectedSource
         drawmcdfcChart($scope,$http);
    }

    $scope.viewLineTrend = function (){
        if( !($scope.viewtype1==false && $scope.viewtype2==false && $scope.viewtype3==false) && ($scope.dt4<=$scope.dt5)){
            $scope.selectAll = true
            drawmcdfcLineTrendChart($scope,$http);
        }
    }

    $scope.isshow = false;

    $scope.viewDetailByType = function (type){
        $scope.isshow = true;
        var url = nodejsURL + "/mecdfsdetail?type="+type+"&env="+$scope.env1+"&date="+getFormatDate($scope.dt1)+"&source="+$scope.selectedSource.value
        console.log(url);
        $http.get(url).success(function(data) {         
            getPaginationData($scope, data, 150);
            $("#query").val("").change();
            })
    }


    $scope.drillup =function (type){
            $scope.isshow = false;
        } 


}]);
