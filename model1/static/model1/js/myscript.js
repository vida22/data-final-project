var mymap;
var time_slider;
var dataList = [];
var heatData;
var heatmapLayer;
var baseLayer;

$(document).ready(function () {
    

  
    time_slider = $('#time-slider').slider({
        formatter: function (value) {
            return value + ":00-" + (value + 1) + ":00";
        }
    })
        .data('slider');

    baseLayer = L.tileLayer(
        'https://api.mapbox.com/styles/v1/ndwei97/cj2m6l3b8000j2rp3vl3lagj4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmR3ZWk5NyIsImEiOiJjajJrcGlxdzMwMGowMzNwOGtoNDN3MWxuIn0.ngyg9fxB7oHXuN5lRsU1bA',
        {maxZoom: 20});

    makeHeatData();

//Sidenav
    //get current page name
    var cur_page = $('.page-name').attr('id');



    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "305px";
        $('#' + cur_page).addClass('red-text');
    }

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0px";
        document.getElementById("main").style.marginLeft = "55px";
    }

    $('#hamburger').click(function () {
        console.log('cliccc');
        openNav();
    });
    $('.closebtn').click(function () {
        closeNav();
    });


    //side nav highlight 
    $('#mySidenav').on('click', '*', function () {
        $('#mySidenav>a.red-text').removeClass('red-text');
        if ($(this).hasClass('closebtn')) {
        } else {
            $(this).addClass('red-text');
            var cur_page = $(this).text();
        }
    });


//Button Groups
    $('.btn-menu').click(function (event) {
        var id = $(this).attr('id');
        activate(id);
    });

//Set time label
    $('.slider-handle').mousemove(function () {
        var selected_time = $('#time-slider').data('slider').getValue();

        $('#time').html('<b>Time:</b> ' + selected_time + ":00-" + (selected_time + 1) + ":00");


    })
  

});

var makeHeatData = function () {
    var day = document.getElementById('sel1').value;
    var weekdayList = ['Saturday', 'Sunday'];
    var isWeekend = day in weekdayList;
    var time = time_slider.getValue();
    // var activeElements = document.getElementsByClassName('active');
    var activeElements = $('button.active');

    for (var i = 0; i < activeElements.length; i++) {
        const category = activeElements[i].childNodes[0].data;
        $.ajax({
            type: 'GET',
            url: '/heatmap?time=' + time + '&isWeekend=' + isWeekend + '&category=' + category,

            success: function (heat_list) {
                for (var i = 0; i < heat_list.length; i++) {
                    var obj = {};
                    var jsonData = JSON.parse(heat_list[i]);
                    obj['lat'] = parseFloat(jsonData.lat);
                    obj['lng'] = parseFloat(jsonData.lng);
                    obj['count'] = parseInt(jsonData.count);
                    dataList.push(obj);
                }
            },

            complete: function () {
                heatData = {
                    max: 0.1,
                    data: dataList
                };

                var cfg = {
                    "radius": 0.01,
                    "maxOpacity": .2,
                    "scaleRadius": true,
                    latField: 'lat',
                    lngField: 'lng',
                    valueField: 'count'
                };

                heatmapLayer = new HeatmapOverlay(cfg);
                heatmapLayer.setData(heatData);

                mymap = L.map('mapid', {layers: [baseLayer, heatmapLayer]}).setView([36.177, -115.170], 13);

                initiatePoint();
            }
        });
    }
};


var initiatePoint = function () {
    var weekday = document.getElementById('sel1').value;
    var time = time_slider.getValue();
    // var activeElements = document.getElementsByClassName('active');
    var activeElements = $('button.active');
    for (var i = 0; i < activeElements.length; i++) {
        const category = activeElements[i].childNodes[0].data;
        $.ajax({
            type: 'GET',
            url: '/search?time=' + time + '&weekday=' + weekday + '&category=' + category,

            success: function (my_list) {
                addPoint(mymap, my_list, category);
            }
        });
    }
};


var showgraph = function (classes) {
  console.log(classes)

             if (classes[0] == "Dance" || classes[0] == "Pool") {
              var class_length = classes.length;
              var business_id = classes[2];
              var business_name = '';
              for (var index = 3; index < class_length - 3; index++) {
                business_name += " " + classes[index];
              }
              var hours_of_today = classes[class_length - 3];
              var weighted_rating = classes[class_length - 2];
            } else  {
              var class_length = classes.length;
              var business_id = classes[1];
              var business_name = '';
              for (var index = 2; index < class_length - 3; index++) {
                business_name += " " + classes[index];
              }
              var hours_of_today = classes[class_length - 3];
              var weighted_rating = classes[class_length - 2];
            }

            var graph_div = document.getElementById('showgraph');


            graph_div.innerHTML = "<span id='closediv' class='glyphicon glyphicon-remove' aria-hidden='true'></span><h2 id=" + business_id + ">"+business_name+ "</h2><br><p><b>Open Hours: </b>"+hours_of_today+"</p><p><b>Score: </b>"+ weighted_rating + ' out of 100</p><br><p>Number of Check-In\'s on Yelp</p>';
            //display(business_id)
            $.get('/checkin_time/?business_id='+business_id+'&weekday=true',function(data){
              //console.log(data)
              var chart = new Chartist.Bar('.bar-chart', {
              labels: ['0am', '', '', '3', '', '', '6', '', '', '9', '', '', '12pm', '', '', '3', '', '', '6', '', '', '9', '', '','12'],
              series: [data]
              }, {
              fullWidth: false,
              height: '150px',
              chartPadding: {
                right: 10,
                top: 20
              },
              lineSmooth: Chartist.Interpolation.cardinal({
                fillHoles: true,
              }),
              low: 0
            });

            var options = {
              seriesBarDistance: 5,
            };

            var responsiveOptions = [
              ['screen and (max-width: 640px)', {
                seriesBarDistance: 1,
                axisX: {
                  labelInterpolationFnc: function (value) {
                    return value[0];
                  }
                }
              }]
            ];

            //this only fires when done

          })//end AJAX called
  
            $('#closediv').click(function(){
               $('#showgraph').addClass('hidden');
              $('#showgraph').hide();
             
    })
          
}




var addPoint = function (my_map, list, category) {
    for (var i = 1; i < list.length; i++) {
        var business_id = list[i][0];
        var business_name = list[i][1];
        var weighted_rating = list[i][2];
        var hours_of_today = list[i][3];
        var longitude = parseFloat(list[i][4]);
        var latitude = parseFloat(list[i][5]);
        var color;
        var opacity = weighted_rating/100*1.2;

        switch (category) {
            case 'Bars':
                color = '#4862FF';
                break;
            case 'Lounges':
                color = '#4862FF';
                break;
            case 'Pubs':
                color = '#4862FF';
                break;
            case 'Dance Clubs':
                color = '#50E3C2';
                break;
            case 'Pool Parties':
                color = '#50E3C2';
                break;
            case 'Casino':
                color = '#E350E1';
                break;
            case 'Shows':
                color = '#E350E1';
                break;
            case 'Churches':
                color = '#E350E1';
        }

        var mycircle = L.circle([latitude, longitude], 100, {
            stroke: false,
            fillColor: color,
            fillOpacity: opacity,
            className: category +" "+business_id+" "+business_name+" "+hours_of_today+" "+weighted_rating,
        }).addTo(my_map).bindPopup("<p style='color:#735cf7'>" + business_name + "</p>");
        
        $('.' + business_id).click(function(){
          showgraph(this.classList);
          
              if($('#showgraph').hasClass('hidden')){
                $('#showgraph').removeClass('hidden').show();
                } else {
                return;
              }
        })
      
    }
};

var activate = function (element_id) {
    var element = document.getElementById(element_id);
    if (element.className.endsWith("active")) {
        element.classList.remove("active");
        const category = element.childNodes[0].data;

        $('path.' + category.split(' ')[0]).remove();
    } else {
        element.classList.add("active");
        var weekday = document.getElementById('sel1').value;
        var time = time_slider.getValue();

        const category = element.childNodes[0].data;
        $.ajax({
            type: 'GET',
            url: '/search?time=' + time + '&weekday=' + weekday + '&category=' + category,

            success: function (my_list) {
                addPoint(mymap, my_list, category);
            }
        });
    }

    makeHeatData();
};

var switchTime = function () {
    $('path').remove();
    initiatePoint();
};



  
  




