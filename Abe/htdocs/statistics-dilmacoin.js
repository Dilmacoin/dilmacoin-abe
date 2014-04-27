$.fn.formatCoins = function(n, c, d, t){
var c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

$().ready(function() {
    var currentBlock = 0;
    
    $.ajax({
        url: "/chain/Dilmacoin/q/getblockcount?format=json",
        dataType: "json"
    }).success(function(data) {
        currentBlock = data;
        
        $.ajax({
            url: "/chain/Dilmacoin/q/nethash/100/0/?format=json",
            dataType: "json"
        }).success(function(nethashData) {
            var times = new Array();
            var difficulties = new Array();
            var hashrates = new Array();
            
            $.each(nethashData, function( difficultyIndex, difficultyValue ) {
                var date = new Date(0);
                date.setUTCSeconds(difficultyValue[1]);
                times[difficultyIndex] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString();
                difficulties[difficultyIndex] = {
                	x: date.getTime(),
                	y: difficultyValue[4]
                };
                
                hashrates[difficultyIndex] = {
                	x: date.getTime(),
                	y: difficultyValue[7] / 1000000 
                }
            });
            
            $('#nethashratecontainer').highcharts({
                chart: {
                	zoomType: 'x',
                	spacingRight: 20
            	},
            	title: {
                	text: 'Network hashrate'
            	},
            	subtitle: {
                	text: document.ontouchstart === undefined ?
                    	'Click and drag in the plot area to zoom in' :
                    	'Pinch the chart to zoom in'
            	},
            	xAxis: {
                	type: 'datetime',
                	maxZoom: 24 * 3600000,
                	title: {
                    	text: null
                	}
            	},
            	yAxis: {
                	title: {
                    	text: 'Hashrate in MH/sec'
                	}
            	},
            	tooltip: {
                	shared: true
            	},
            	legend: {
                	enabled: false
            	},
            	plotOptions: {
                	area: {
                    	fillColor: {
                        	linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        	stops: [
                            	[0, Highcharts.getOptions().colors[0]],
                            	[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        	]
                    	},
                    	lineWidth: 1,
                    	marker: {
                        	enabled: false
                    	},
                    	shadow: false,
                    	states: {
                        	hover: {
                            	lineWidth: 1
                        	}
                    	},
                    	threshold: null
                	}
            	},
            	series: [{
            		type: 'area',
                	name: 'MH/sec',
                	data: hashrates
            	}]
            });
            
            $('#difficultycontainer').highcharts({
                chart: {
                	zoomType: 'x',
                	spacingRight: 20
            	},
            	title: {
                	text: 'Network difficulty'
            	},
            	subtitle: {
                	text: document.ontouchstart === undefined ?
                    	'Click and drag in the plot area to zoom in' :
                    	'Pinch the chart to zoom in'
            	},
            	xAxis: {
                	type: 'datetime',
                	maxZoom: 24 * 3600000,
                	title: {
                    	text: null
                	}
            	},
            	yAxis: {
                	title: {
                    	text: 'Difficulty'
                	},
                	min: 0
            	},
            	tooltip: {
                	shared: true
            	},
            	legend: {
                	enabled: false
            	},
            	plotOptions: {
                	area: {
                    	fillColor: {
                        	linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        	stops: [
                            	[0, Highcharts.getOptions().colors[0]],
                            	[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        	]
                    	},
                    	lineWidth: 1,
                    	marker: {
                        	enabled: false
                    	},
                    	shadow: false,
                    	states: {
                        	hover: {
                            	lineWidth: 1
                        	}
                    	},
                    	threshold: null
                	}
            	},
            	series: [{
            		type: 'area',
                	name: 'Difficulty',
                	data: difficulties
            	}]
            });
        });
    });
    
    $.ajax({
        url: "/chain/Dilmacoin/q/totalbc?format=json",
        dataType: "json"
    }).success(function(data) {
        var mined = (parseInt(data));
        var unmined = parseInt(50547600 - mined);
        var premined = 16000000; 
        $('#minedcontainer').highcharts({
            title: {
                text: 'Mined Dilmacoins'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' % (' + $().formatCoins(this.point.y, 2, ".", ",") + " Dilmacoins)";
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Mining progress',
                data: [
		   
                    ['Mined', mined],
                    ['Unmined', unmined]
                ]
            }]
        });
    });
});
