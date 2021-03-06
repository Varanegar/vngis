﻿/// <reference path="markerwithlabel.js" />
var gmap;
var gmap_markers = [];
var gmap_markers_cluster = [];
var gmap_shaps = [];
var gmap_infoBubble = [];
var gmap_moving_shape;
var gmap_bounds = new google.maps.LatLngBounds();
var gmap_infoWindow;
var gmap_markerCluster;

// ----------------------------------------------------------
// Map
// ----------------------------------------------------------
function initMap(elementId, center) {
	// Create a map object and specify the DOM element for display.
	gmap = new google.maps.Map(document.getElementById(elementId), {
		center: center,
//		scrollwheel: false,
		zoom: 11
	});
	//gmap.addListener('idle', function (e) { closeInfoWindow() });
	clearOverlays();

}

function setMarkerMap(map) {
    for (var i = 0; i < gmap_markers.length; i++) {
       gmap_markers[i].setMap(map);
    }
}

function clearOverlays() {
    setMarkerMap(null);

    for (var i = 0; i < gmap_shaps.length; i++) {
        gmap_shaps[i].setMap(null);
    }
    gmap_shaps = [];

    for (var i = 0; i < gmap_infoBubble.length; i++) {
        gmap_infoBubble[i].setMap(null);
    }
    gmap_infoBubble = [];
    
    gmap_markers = [];
    gmap_bounds = new google.maps.LatLngBounds();
    closeInfoWindow();
    gmap_markers_cluster = [];
    if (gmap_markerCluster) {
        gmap_markerCluster.clearMarkers();
    }
}

function renderClusterMarkers() {
    var mcOptions = { gridSize: 50, maxZoom: 15, hideSingleGroupMarker: true };
    gmap_markerCluster = new MarkerClusterer(gmap, gmap_markers_cluster, mcOptions);
}

function fitPointBounds() {
    if (! gmap_bounds.isEmpty())
        gmap.fitBounds(gmap_bounds);
}

function addListener(event, fn) {
    gmap.addListener(event, fn);
}
function removeListener(event) {
    google.maps.event.clearListeners(gmap, event);
}

function getSpace() {
    var zoom = gmap.getZoom();
    if (zoom <= 5) return 1;
    if (zoom <= 8) return 0.2;
    if (zoom <= 10) return 0.1;
    if (zoom <= 11) return 0.02;
    if (zoom <= 12) return 0.008;
    if (zoom <= 13) return 0.005;
    if (zoom <= 14) return 0.002;
    if (zoom <= 16) return 0.0015;
    if (zoom <= 18) return 0.001;
    else return 0.1;
}

// ----------------------------------------------------------
// Markers
// ----------------------------------------------------------
function addMarker(opt_options) { 
    var options = opt_options || {};
    var id = options['id'] || '';
    var lat = options['lat'] || 0;
    var lng = options['lng'] || 0;
    var tit = options['tit'] || '';
    var drg = options['draggable'] || false;
    var windowdesc = options['windowdesc'] || '';
    var clustering = options['clustering'] || false; 
    var label = options['label'] || '';
    var fit = options['fit'] || false;

    var marker;

    if ((label == null) || (label == undefined) || (label == '')) {
        marker = new google.maps.Marker({
            Id: id,
            position: new google.maps.LatLng(lat, lng),
            draggable: drg,
            optimized: false
        });
    }
    else{
        marker = new MarkerWithLabel({
            Id: id,
            position: new google.maps.LatLng(lat, lng),
            draggable: drg,            
            labelContent: label,
            labelAnchor: new google.maps.Point(22, 35),
            labelClass: "labels", // the CSS class for the label
            labelStyle: { opacity: 0.75 }
        });
    }

    if (clustering == false) {
        marker.setMap(gmap);
    }
    
    if ((tit != null) && (tit != undefined) && (tit != '')) {
        marker.Title = tit;
    }
    // -------
    if ((windowdesc != null) && (windowdesc != undefined) && (windowdesc != '')) {
        marker.addListener('click', function (event) {
            openInfoWindow(new google.maps.LatLng(lat, lng), windowdesc);
        });
    }
    // -------
    if (clustering != false) {
        gmap_markers_cluster.push(marker);
    }
    gmap_markers.push(marker);
    if (fit == true) {
        gmap_bounds.extend(marker.position);
    }
    return marker;
}

function getMarkerById(id) {
    var index = getMarkerIndexById(id);
    if (index > -1) {
        return gmap_markers[index];
    }
    else return null;

}
function getMarkerIndexById(id) {
    var index = -1;
    for (var i = 0; i < gmap_markers.length; i++) {
        if (gmap_markers[i].Id == id) {
            index = i;
            break;
        }
    }
    return index;

}

function removeMarkerById(id) {
    var index = getMarkerIndexById(id);
    if (index > -1) {
        closeInfoWindow();
        gmap_markers[index].setMap(null);
        gmap_markers.splice(index, 1);
    }


}

// ----------------------------------------------------------
// InfoWindow
// ----------------------------------------------------------
function closeInfoWindow() {
    if (gmap_infoWindow) {
        gmap_infoWindow.close();
    }
    gmap_infoWindow = new google.maps.InfoWindow();

}

function openInfoWindow(latlng, windowdesc) {
    closeInfoWindow();
    gmap_infoWindow.setContent("<div id='infoWindow'>"+windowdesc+"</div>");
    gmap_infoWindow.setPosition(latlng);
    //gmap_infoWindow.setMaxWidth(300);
    gmap_infoWindow.open(gmap);
}

// ----------------------------------------------------------
// Polyline
// ----------------------------------------------------------

function addPolyline(opt_options) {
    var options = opt_options || {};
    var direction = options['direction'] || false;
    var linecoordinates = options['line'] || [];
    var color = options['color'] || '#000000';
    var weight = options['weight'] || 2;
    var windowdesc = options['windowdesc'] || '';
    var movingshape = options['movingshape'] || false;
    var dashed = options['dashed'] || false;
    var fit = options['fit'] || false;

    var lable = options['lable'] || '';
    var lableclass = options['lableclass'] || '';
    var lablewindowdesc = options['lablewindowdesc'] || '';
    

    if ((lable == null) || (lable == undefined)) lable = '';
    if ((windowdesc == null) || (windowdesc == undefined)) windowdesc = '';


    var opacity = 1;

    var symbolStart = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
        strokeColor: '#e00',
        fillColor: '#222',
        fillOpacity: 1
    };

    var symbolEnd = {
        path: 'M -2,-2 2,2 M 2,-2 -2,2',
        strokeColor: '#e00',
        strokeWeight: 4
    };

    var symbolDash = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
    };

    var symbolArrow = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, //'m223.606,151.608l-80.046-80.046c-15.661-15.661-45.243-15.661-60.904,0l-80.046,80.046c-3.48,3.48-3.48,8.701 4.44089e-16,12.181s8.701,3.48 12.181,0l80.046-80.046c10.441-10.441 26.102-10.441 36.543,0l80.046,80.046c1.74,1.74 5.22,1.74 6.96,1.74 1.74,0 5.22,0 5.22-1.74 3.48-3.48 3.48-8.701 0-12.181z',
        strokeOpacity: 0.8,
    };

    var ico = null;

    if (dashed == true) {
        opacity = 0;
        ico = [
            {
                icon: symbolDash,
                offset: '0',
                repeat: '20px'
            }
        ];
    }

    if (direction == true) {
        ico = [
            {
                icon: symbolStart,
                offset: '0%'
            },
            {
                icon: symbolArrow,
                offset: '10%',
                repeat: '50px'
            },
            {
                icon: symbolEnd,
                offset: '100%'
            }
        ];

    }

    var path = new google.maps.Polyline({
        path: linecoordinates,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: opacity,
        strokeWeight: weight,
        icons : ico
    });
    path.setMap(gmap);


    // -------- window
    if ((windowdesc != null) && (windowdesc != undefined) && (windowdesc != '')) {
        path.addListener('click', function (event) {
            openInfoWindow(event.latLng, windowdesc);
        });
    }


    // ------- lables
    if ((lable != '') ) {
        addLableToPoly(linecoordinates, lable, lableclass, false, lablewindowdesc);
    }
    // ------- fit to bounds
    if ((fit == true)&&(linecoordinates.length > 0)) {
        gmap_bounds.extend(linecoordinates[0]);
        gmap_bounds.extend(linecoordinates[linecoordinates.length - 1]);
        if (linecoordinates.length > 4)
            gmap_bounds.extend(linecoordinates[Math.round(linecoordinates.length / 2)]);

    }
    if (movingshape == true) {
        gmap_moving_shape = path;
    }
    gmap_shaps.push(path);
    return path;
}

function addLableToPoly(line, lable, lableclass, ispolygon , windowdesc) {
    if ((windowdesc == null) || (windowdesc == undefined)) windowdesc = '';

    if (line.length > 0) {
        var isline = false;
        if ((ispolygon == false) &&
            (line[0].lat() != line[line.length - 1].lat()) &&
            (line[0].lng() != line[line.length - 1].lng()))
            isline = true;

        var center;
        if (isline == false) {
            var bound = new google.maps.LatLngBounds();
            for (var i = 0; i < line.length; i++) {
                bound.extend(line[i]);
            }
            center = bound.getCenter();
        }
        else {
            center = line[Math.round((line.length / 2))];
        }
        if ((lableclass || '') == '')
            lableclass = "line-labels";
        var marker = new MarkerWithLabel({
            position: center,
            draggable: false,
            map: gmap,
            labelContent: lable,
            labelAnchor: new google.maps.Point(100, -5),
            icon:{ url: "../Content/img/pin/center.png", size: new google.maps.Size(6, 6), anchor: new google.maps.Point(3, 3) },
            labelClass: lableclass, // the CSS class for the label
           // labelStyle: { opacity: 0.5 }
        });

        if (windowdesc != '') {
            marker.addListener('click', function (event) {
                  closeInfoWindow();
                  openInfoWindow(center, windowdesc);
                });
        }
        gmap_markers.push(marker);
        return marker;
    }
    return null;
}


function openInfoBubble(marker, windowdesc) {


   var infoBubble = new InfoBubble({
        map: gmap,
        content: windowdesc,
        position: marker.getPosition(),
        shadowStyle: 1,
        padding: 13,
        backgroundColor: '#fff',
        borderRadius: 10,
        arrowSize: 20,
        borderWidth: 1,
        borderColor: '#aaa',
        disableAutoPan: true,
        arrowPosition: 30,
        //backgroundClassName: 'phoney',
        arrowStyle: 2,
        minWidth: 250,
        maxHeight:150,
        hideCloseButton: true
    });
    gmap_infoBubble.push(infoBubble);
    infoBubble.open();
}
// ----------------------------------------------------------
// Polygon
// ----------------------------------------------------------

function addPolygon(opt_options) {

    var options = opt_options || {};
    //polygon
    var linecoordinates = options['line'] || [];
    var color = options['color'] || '#000000';
    var fillcolor = options['fillcolor'] || '#F46717';
    var weight = options['weight'] || 2;
    var windowdesc = options['windowdesc'] || '';
    var movingshape = options['movingshape'] || false;
    var fit = options['fit'] || false;
    // lable
    var lable = options['lable'] || '';
    var lableclass = options['lableclass'] || '';
    var lablewindowdesc = options['lablewindowdesc'] || '';

    var polygon = new google.maps.Polygon({
        path: linecoordinates,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillcolor,
        fillOpacity: 0.15
    });
    polygon.setMap(gmap);
    // --------
    if (windowdesc != '') {
        polygon.addListener('click', function (event) {
            openInfoWindow(event.latLng, windowdesc);
        });
    }
    // ------- lables
    if ((lable != '') ) {
        addLableToPoly(linecoordinates, lable, lableclass, true, lablewindowdesc);
    }
    // --------
    if (movingshape == true) {
        gmap_moving_shape = polygon;
    }
    if (fit == true) {
        for (var i = 0; i < linecoordinates.length; i++) {
            gmap_bounds.extend(linecoordinates[i]);
        }
    }
    gmap_shaps.push(polygon);
    return polygon;
}
// ----------------------------------------------------------
// Moving shape
// ----------------------------------------------------------
function refreshMovingShape(line) {
    if (gmap_moving_shape) {
        gmap_moving_shape.setPath(line);
    }

}