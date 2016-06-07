'use strict';

/* Controllers */


var baseURL = "http://16.152.122.101:3000"; 
var myControllers = angular.module('phonecatControllers', []);

function drawErrorChart($scope,$http,env) {
    //var url = "phones/"+env+".json";
    var url = baseURL+ "/server";
    $.ajax(url, {  
    data: {Environment:env},  
    dataType: 'json',  
    crossDomain: true,  
    async: false,
    success: function(data) {  
        $scope.mycharts = {   
            chart: {       
                zoomType: 'x'
            },
            title: {
                text: $scope.env + ' Error Summary'
            },

            xAxis: [{
                 type: 'datetime',  
                 crosshair: true

            }],

            yAxis: [{
              opposite: false,
           
                title: {
                    text: 'Total Response Time (mins) ',
                    
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            },{ // Secondary yAxis
                
            title: {
                    text: 'Average Response Time (mins)',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }
            }, ],
            navigator: {
                series: {
               
                 fillOpacity: 0,
                    lineWidth: 0,
              
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
        var title = ["Operation Response Time","OnCall Response Time","OnCall Fix Time","Operation Re-exec Time"];
        var i,j;
        var day,month,year;

        for (i = 0; i < title.length; i++) { 
             $scope.mycharts.series[i] = {
                    type: 'column',
                    yAxis: 0,
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

        $scope.pageSize = 25;
        $scope.currentPage = 1;
        $scope.total = data.series.data.length;

        $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
       
        $scope.pageChanged = function () {
            performSearch();
        };

       
        function performSearch() {
             $scope.mids = data.series.data.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);   
        }

         performSearch();
    }    
    });  
}

function drawPerformanceChart($scope,$http,env){
       
        var url = baseURL+ "/performance";
        $.ajax(url, {  
        data: {type:'memory',Environment:env},  
        dataType: 'json',  
        crossDomain: true,
        async: false,
        success: function(data) {  
        if(data && data.resultcode == '200'){  
          alert('data not ready');           
        } else{ 
            $scope.Performancechart = {
                rangeSelector: {
                        selected: 1,                   
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
                                text: $scope.env+' Mem Alloc & Disk IO & CPU Busy & Elapsed Time charts'
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
                            text: 'Observed for Today'
                        },
                    plotOptions: {
                                series: {
                                    pointInterval: 24 * 3600 * 1000// one day
                                }
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

                var i,j,z;
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
        }  
        });
        
        $.ajax(url, {  
        data: {type:'row',Environment:env},  
        dataType: 'json',  
        crossDomain: true,
        async: false, 
        success: function(data) { 
        if(data && data.resultcode == '200'){  
            alert('data not ready');            
        } else{  
            $scope.Performancechart2 = {
            rangeSelector: {
                    selected: 1
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
                            text: $scope.env+' Rows Accessed & Rows IUD & File size & Elapsed Time charts'
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
                        text: 'Observed for Today'
                    },
            plotOptions: {
                            series: {
                                pointInterval: 24 * 3600 * 1000// one day
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
        }
        });
}

function drawRollupErrorChart($scope,$http,env){
    var url = baseURL+ "/error";
    $.ajax(url, {  
    data: {Environment:env},  
    dataType: 'json',  
    crossDomain: true,  
    async: false,
    success: function(data) {      
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
                    text: 'Multiple Rollup Error & Elapsed Time charts - Time Based'
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
                                labels: {
                items: [{
                    html: '* System error: Database/Network connection issue can be fixed by restarting the job',
                    style: {
                        left: '100px',
                        top: '300px',
                        cursor: 'pointer',
                        color: '#333366',
                        fontSize: '12px'
                    }
                }]
                },
                  tooltip: {                    
                        shared          : true,
                        formatter: function () { 
                                                var s = '<b>Date:  </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x)+
                                                            '<br><b>Rollup error(Mins): </b>'+'<span style="color:#A5AAD9;">Total </span>'+'<b>'+this.points[0].y+'  |  ' +'</b>'+'<span style="color:#996DA2;"> Oncall </span>'+'<b>'+this.points[1].y+'</b>'+
                                                '<br><b>System error(Mins): </b>'+'<span style="color:#F8A13F;">Total </span>'+'<b>'+this.points[2].y+'  |  ' +'</b>'+'<span style="color:#BA3C3D;"> Oncall </span>'+'<b>'+this.points[3].y+'</b>'+
                                                            '<br><b>Error in Critical Path(Mins): </b>'+'<span style="color:#33CC33;">Total </span>'+'<b>'+this.points[4].y+'  |  ' +'</b>'+'<span style="color:#1F7A1F;"> Oncall </span>'+'<b>'+this.points[5].y+'</b>'+
                                                            '<br><b>Elapse Time(Hours): </b>'+this.points[6].y;
                        return s;            
                                                  }
                        },
     
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                        enabled: false                 //Credits 名片   (右下角，默认为true)
                    }
        };

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
        for( i = 0; i < data.Time.length-1; i++){
            $scope.rolluperrorchart1.series[i] = {
                    name: data.Time[i].name ,   
                    color: color[i],
                    pointPadding: pointPadding[i],
                    pointWidth: pointWidth[i],
                    pointPlacement: pointPlacement[i],
                    type: 'column',
                };
        }
            $scope.rolluperrorchart1.series[6] = {
                    name: data.Time[6].name ,   
                    color: color[6],
                    type: 'spline',
                    tooltip: {
                        valueSuffix: 'h'
                    },
                    yAxis: 1
            }
        for( i = 0; i < data.Time.length; i++){        
            $scope.rolluperrorchart1.series[i].data = [];
            for(j = 0; j<data.Time[i].dataset.length; j++){
                var time = data.Time[i].dataset[j].x.split("-");
                year = parseInt(time[0]);
                month = parseInt(time[1])-1;
                day = parseInt(time[2]);
                 $scope.rolluperrorchart1.series[i].data[j] = {
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
                chart: {
                                                        zoomType: 'xy'
                },
                title: {
                    text: 'Multiple Rollup Error & Elapsed Time charts - Number Based'
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
                                labels: {
                items: [{
                    html: '* System error: Database/Network connection issue can be fixed by restarting the job',
                    style: {
                        left: '100px',
                        top: '300px',
                                                                                    cursor: 'pointer',
                                                                                    color: '#333366',
                                                                                    fontSize: '12px'
                    }
                }]
                },
                  tooltip: {                    
                        shared          : true,
                        formatter: function () { 
                                                var s = '<b>Date:  </b>'+Highcharts.dateFormat('%Y-%m-%d ',this.x)+
                                                            '<br><b>Rollup error: </b>'+'<span style="color:#A5AAD9;">Total </span>'+'<b>'+this.points[0].y+'  |  ' +'</b>'+'<span style="color:#996DA2;"> Oncall </span>'+'<b>'+this.points[1].y+'</b>'+
                                                '<br><b>System error: </b>'+'<span style="color:#F8A13F;">Total </span>'+'<b>'+this.points[2].y+'  |  ' +'</b>'+'<span style="color:#BA3C3D;"> Oncall </span>'+'<b>'+this.points[3].y+'</b>'+
                                                            '<br><b>Error in Critical Path: </b>'+'<span style="color:#33CC33;">Total </span>'+'<b>'+this.points[4].y+'  |  ' +'</b>'+'<span style="color:#1F7A1F;"> Oncall </span>'+'<b>'+this.points[5].y+'</b>'+
                                                            '<br><b>Elapse Time(Hours): </b>'+this.points[6].y;
                        return s;            
                                                  }
                        },
     
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                credits: {                                   //get rid  of the tooltip "highchart.com" on lower right corner
                        enabled: false                 //Credits 名片   (右下角，默认为true)
                    }
        };

        $scope.rolluperrorchart2.series = [];
        for( i = 0; i < data.Number.length-1; i++){
            $scope.rolluperrorchart2.series[i] = {
                    name: data.Number[i].name ,   
                    color: color[i],
                    pointPadding: pointPadding[i],
                    pointWidth: pointWidth[i],
                    pointPlacement: pointPlacement[i],
                    type: 'column',
                };
        }
            $scope.rolluperrorchart2.series[6] = {
                    name: data.Number[6].name ,   
                    color: color[6],
                    type: 'spline',
                    tooltip: {
                        valueSuffix: 'h'
                    },
                    yAxis: 1
            }
        for( i = 0; i < data.Number.length; i++){        
            $scope.rolluperrorchart2.series[i].data = [];
            for(j = 0; j<data.Number[i].dataset.length; j++){
                var time = data.Number[i].dataset[j].x.split("-");
                year = parseInt(time[0]);
                month = parseInt(time[1])-1;
                day = parseInt(time[2]);
                 $scope.rolluperrorchart2.series[i].data[j] = {
                    x:Date.UTC(year, month, day),
                    y:data.Number[i].dataset[j].y
                };   
            }    
        }
    }
    });
}

function drawCriticalPathChart($scope,$http,env,dt){


 $http.get("phones/cpm.json").success(function(data) {

    $scope.cpm = {

        chart: {
            type: 'columnrange',
            inverted: true,
        },

        title: {
            text: 'Normalization Running Percentage Charts'
        },

        subtitle: {
            text: 'Observed in HPE, ShangHai'
        },

        xAxis: {reversed: false,
                categories: [0, 1, 2],
                labels: {
                    style: {
                        color: "rgba(0, 0, 51, .7)"
                   }
                },
               title: {
                    text: 'normalization rate(%)',
                    style: {
                        color: "rgba(0, 0, 51, .7)"
                    }
                },
                 plotLines: [{
                        value: 1.5,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                        label: {
                            text: '2'
                        }
                    }, {
                        value: 2.5,
                        color: 'red',
                        dashStyle: 'shortdash',
                        width: 2,
                        label: {
                            text: '3'
                        }
                    }]
            },

        yAxis: {
            type: 'datetime',
            tickInterval: 3600 * 1000 * 2,
            title: {
                text: 'TIME ( UTC )'
            }
        },

        tooltip: {
            formatter: function () {
     return '<b>'+this.x+' '+this.series.name+'</b>  <br/> <b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); }
            },

        plotOptions: {
            series: {
            grouping: true,
            pointWidth: 25}
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Start-End',
            data: [[1, Date.parse("2015/10/18 00:59:00 UTC"), Date.parse("2015/10/18 00:59:01 UTC")]
          ],
        zoneAxis: 'x',
        zones: [{ //different bar have different color
                value: 1,
                color: '#90ed7d'
            }, {
                value: 2,
                color: '#E6E600'
            }, {
                color: '#E6005C'
            }],
        }]

    }
    var i;
    // for( i = 0; i < data.data.length-1; i++){

    //     if (data.data[i].PERCENTAGE > 90 ){
    //         $scope.cpm.series[0].data[i] = 
    //         [2
    //         ,Date.parse(data.data[i].START_TS)
    //         ,Date.parse(data.data[i].END_TS)];
    //     } else if (data.data[i].PERCENTAGE > 60){
    //         $scope.cpm.series[0].data[i] = 
    //         [1
    //         ,Date.parse(data.data[i].START_TS)
    //         ,Date.parse(data.data[i].END_TS )];
    //     } else{
    //         $scope.cpm.series[0].data[i] = 
    //         [0
    //         ,Date.parse(data.data[i].START_TS)
    //         ,Date.parse(data.data[i].END_TS )];
    //     }  
    // }


        $scope.pageSize = 25;
        $scope.currentPage = 1;
        $scope.total = data.data.length;

        $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
       
        $scope.pageChanged = function () {
            performSearch();
        };

        function performSearch() {
             $scope.events = data.data.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);   
        }

         performSearch();

    });
}

myControllers.controller('DashBoardCtrl',['$scope', '$http',
function($scope,$http) {
     //var url = 'phones/chart.json';  
    var url = baseURL+ "/dailyrolluptime";
    $.ajax(url, {  
        data: {},  
        dataType: 'json',  
        crossDomain: true, 
        async: false, 
        success: function(data) {  
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
                                    pointWidth: 25,   
                                }
                            },
                        xAxis: {
                                categories: ['ZEO', 'EMR', 'JAD'],
                                
                            },  
                        yAxis: {
                                type: 'datetime',
                                 tickInterval: 3600 * 1000 * 2,
                                 min: Date.parse(data.date+" 22:00:00 UTC")-3600*1000*24,
                                 max: Date.parse(data.date+" 05:00:00 UTC")+3600*1000*24,
                                 plotBands: [               
                                 { // visualize the ZEO
                                    from: Date.parse(data.date+" 01:00:00 UTC"),
                                    to: Date.parse(data.date+" 01:05:00 UTC")  ,        
                                    color: '#944A63',        
                                 },
                                     
                                 { // visualize the ZEO
                                    from: Date.parse(data.date+" 09:30:00 UTC"),
                                    to: Date.parse(data.date+" 09:35:00 UTC"),
                                    color: '#944A63',          
                                 },
                                    
                                  { // visualize the ZEO
                                    from: Date.parse(data.date+" 01:00:00 UTC"),
                                    to: Date.parse(data.date+" 09:30:00 UTC"),
                                    color: 'rgba(148, 74, 99, .1)',
                                    label: {
                                        text: 'ZEO Window',
                                        align: 'center',        
                                    }
                                 },
                                               
                                     { // visualize the EMR
                                    from: Date.parse(data.date+" 08:00:00 UTC"),
                                    to: Date.parse(data.date+" 08:05:00 UTC") ,             
                                    color: '#4A947B',     
                                 },
                                      { // visualize the EMR
                                    from: Date.parse(data.date+" 17:30:00 UTC"),
                                    to: Date.parse(data.date+" 17:35:00 UTC")  ,            
                                    color: '#4A947B',
                                 },
                                   { // visualize the EMR
                                    from: Date.parse(data.date+" 08:00:00 UTC"),
                                    to: Date.parse(data.date+" 17:30:00 UTC"),
                                    color: 'rgba(74, 148, 123, .1)',
                                    label: {
                                        text: 'EMR Window',                 
                                        align: 'center',        
                                    }
                                 },
                                    { // visualize the JAD
                                    from: Date.parse(data.date+" 19:00:00 UTC"),
                                    to: Date.parse(data.date+" 19:05:00 UTC") ,           
                                    color: '#44AAD5',     
                                 },
                                      { // visualize the JAD
                                    from: Date.parse(data.date+" 03:30:00 UTC")+3600*1000*24,
                                    to: Date.parse(data.date+" 03:35:00 UTC")+3600*1000*24,               
                                    color: '#44AAD5',
                                 }, 
                                     
                                     { // visualize the JAD
                                    from: Date.parse(data.date+" 19:00:00 UTC"),
                                    to: Date.parse(data.date+" 03:30:00 UTC")+3600*1000*24,
                                    color: 'rgba(68, 170, 213, .1)',
                                     label: {
                                        text: 'JAD Window',                 
                                        align: 'center',        
                                    }
                                 }],
                                title: {
                                    text: 'UTC Time'
                                }
                            }, 
                        tooltip: {
                         formatter: function() {
                                if  (this.series.name.match("is running")){
                                 return '<b>'+this.x+' '+this.series.name+'</b>  <br/> <b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high); 
                             }
                             else if  (this.series.name.match("not started")){
                                   return '<b>'+this.x+' '+this.series.name+'</b><br/> <b>EstimatedStartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EstimatedEndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high);
                             }
                             else {
                                 return '<b>'+this.x+' '+this.series.name+'</b> <br/> <b>StartTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.low)+'<br/> <b>EndTime: </b>'+Highcharts.dateFormat('%y/%m/%d %H:%M',this.point.high);
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

                    var i,j;
                    $scope.mycharts.series = [];
                    var padding = [0.2,0.3,0.1,-0.1,0,0.8,0.5,0.3,0.4];
                    for (i = 0; i < data.info.length; i++) { 
                        $scope.mycharts.series[i] = {
                            name: data.info[i].name,
                            color: data.info[i].color,
                            groupPadding: padding[i]
                        };
                        if (data.info[i].name.match('Rollup')) {
                            $scope.mycharts.series[i].pointWidth = 50;
                        };
                        $scope.mycharts.series[i].data = [];      
                        j=0;
                        for (j = 0; j < data.info[i].x; j++) { 
                            $scope.mycharts.series[i].data[j] = [];
                        }
                        $scope.mycharts.series[i].data[j] =[
                              Date.parse(data.info[i].data[0]+"  UTC"),
                              Date.parse(data.info[i].data[1]+"  UTC")

                        ]; 
                    }
            }
        }  
    });
}]);


myControllers.controller('OnCallErrorCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.env = 'ZEO'; 
    $scope.$watch('env', function() {
         drawErrorChart($scope,$http,$scope.env); 
    });
}]);

myControllers.controller('PerforamnceCtrl',['$scope', '$http',
function($scope,$http){  
    $scope.env = 'BER';     
    $scope.$watch('env', function() {
        drawPerformanceChart($scope,$http,$scope.env); 
    });    
}]);

myControllers.controller('RollupErrorCtrl',['$scope', '$http',
function($scope,$http){  
    $scope.env = 'BER';     
    $scope.$watch('env', function() {
        drawRollupErrorChart($scope,$http,$scope.env); 
    });    
}]);

myControllers.controller('CpathCtrl',['$scope', '$http',
function($scope,$http) {
    $scope.chartObj; // this will contain a reference to the highcharts' chart objec
    $http.get("phones/chart.json").success(function(data) {
        $scope.basicAreaChart = data;
    });
}]);

myControllers.controller('RmetricCtrl',['$scope', '$http',
function($scope,$http) {
    var url = baseURL+ "/rollupmatic";    
    $.ajax(url, {  
        data: {},  
        dataType: 'json',  
        crossDomain: true,
        async: false,
        success: function(data) {
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
                    text: 'MEC Rollup Run Time'
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
                    text: 'Non-MEC Rollup Run Time'
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
            $scope.rollupRunMec =  data.rollupRun.MEC[0]+data.rollupRun.MEC[1]+data.rollupRun.MEC[2];
            $scope.rollupRunNonMec =  data.rollupRun.NonMEC[0]+data.rollupRun.NonMEC[1]+data.rollupRun.NonMEC[2];
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
                    text: 'MEC Rollup Delay Time'
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
                        name: "Delay Time &lt;= 20 mins",             //  &lt;=  means  <
                        y: data.rollupDelay.MEC[0],
                        color: "rgba(102, 204, 51, 0.8)"
                    }, {
                        name: "20 &lt; Delay Time  &lt; 40 mins",
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
                        name: "Delay Time &lt;= 20 mins",             //  &lt;=  means  <
                        y: data.rollupDelay.NonMEC[0],
                        color: "rgba(102, 204, 51, 0.8)"
                    }, {
                        name: "20 &lt; Delay Time  &lt; 40 mins",
                        y: data.rollupDelay.NonMEC[1],
                        sliced: true,
                        selected: true,
                        color: "rgba(255, 204, 51, 0.8)"
                    },
                    {
                        name: "Delay Time >= 40 mins",
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
            $scope.rollupDelayMec =  data.rollupDelay.MEC[0]+data.rollupDelay.MEC[1]+data.rollupDelay.MEC[2];
            $scope.rollupDelayNonMec =  data.rollupDelay.NonMEC[0]+data.rollupDelay.NonMEC[1]+data.rollupDelay.NonMEC[2];
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
                    text: 'MEC Ticket Duration'
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
            $scope.ticketDuationMec =  data.ticketDuration.MEC[0]+data.ticketDuration.MEC[1];
            $scope.ticketDuationNonMec =  data.ticketDuration.NonMEC[0]+data.ticketDuration.NonMEC[1];
            
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
        }
    });
}]);


myControllers.controller('BmetricCtrl',['$scope', '$http',
function($scope,$http) {

    var url = baseURL+ "/meticstwo";
    $.ajax(url, {  
        data: {},  
        dataType: 'json',  
        crossDomain: true, 
        async: false, 
        success: function(data) {  
        $scope.bmetric = data;
        }
    });
}]);


myControllers.controller('HeaderController',['$scope', '$location', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
      return $location.path() == path;
    };
  }]);


myControllers.controller('CPMCtrl',['$scope', '$http',
function($scope,$http) {

    $scope.env = "BER";
    $scope.$watch('env', function() {
        drawCriticalPathChart($scope,$http,$scope.env,$scope.dt);
    });    
    $scope.$watch('dt', function() {
        drawCriticalPathChart($scope,$http,$scope.env,$scope.dt);
    });    

    $scope.today = function() {
    $scope.dt = new Date();
      };

      $scope.today();

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
}]);