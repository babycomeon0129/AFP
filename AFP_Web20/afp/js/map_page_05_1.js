var map;
var markersArray = [];

function initMap() {
    // 載入路線服務與路線顯示圖層
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(25.0486942, 121.5449298),
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e9e9e9"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dedede"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#333333"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            }
        ]
    });

    addMarker({lat: 25.051865, lng: 121.544745}, "boarding");
    addMarker({lat: 25.048136, lng: 121.547851}, "getoff");
    addMarker({lat: 25.047937, lng: 121.545416}, "taxi");

    function addMarker(latLng, status) {
        var url = "../img/callcar/map/";
        url += status + "-dot.svg";
      
        let marker = new google.maps.Marker({
          map: map,
          position: latLng,
          icon: {
            url: url
          }
        });
      
        //store the marker object drawn in global array
        markersArray.push(marker);
      }

    // 放置路線圖層
    directionsDisplay.setMap(map);

    // 路線相關設定
    var request = {
        origin: {
            lat: 25.051865,
            lng: 121.544745
        },
        destination: {
            lat: 25.048136,
            lng: 121.547851
        },
        travelMode: 'DRIVING'
    };

    // 繪製路線
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            // 回傳路線上每個步驟的細節
            console.log(result.routes[0].legs[0].steps);
            directionsDisplay.setDirections(result);
        } else {
            console.log(status);
        }
    });

    var iconBase = '../img/callcar/map/';

    var icons = {
        location: {
            icon: iconBase + 'location.svg'
        },
        user: {
            icon: iconBase + 'user.svg'
        },
        taxi: {
            icon: iconBase + 'taxi.svg'
        }
    };

    var features = [{
        position: new google.maps.LatLng(25.051865, 121.544745),
        type: 'taxi'
    }, {
        position: new google.maps.LatLng(25.048136, 121.547851),
        type: 'taxi'
    }, {
        position: new google.maps.LatLng(25.048676, 121.545433),
        type: 'user'
    }];

    // Create markers.
    // for (var i = 0; i < features.length; i++) {
    //     var marker = new google.maps.Marker({
    //         position: features[i].position,
    //         icon: icons[features[i].type].icon,
    //         map: map
    //     });
    // };
}