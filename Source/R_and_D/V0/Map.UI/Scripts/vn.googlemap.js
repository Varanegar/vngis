﻿/// <reference path="markerwithlabel.js" />
var gmap;
var gmap_markers = [];
var gmap_markers_cluster = [];
var gmap_shaps = [];
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
    gmap.fitBounds(gmap_bounds);
}

function addListener(event, fn) {
    gmap.addListener(event, fn);
}
function removeListener(event) {
    google.maps.event.clearListeners(gmap, event);
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
    var clustering = options['clustering'] || true; 
    var label = options['label'] || '';
    var fit = options['fit'] || false;

    var marker;

    if ((label == null) || (label == undefined) || (label == '')) {
        marker = new google.maps.Marker({
            Id: id,
            position: new google.maps.LatLng(lat, lng),
            draggable: drg,
            map: gmap,
            optimized: false
        });
    }
    else{
        marker = new MarkerWithLabel({
            Id: id,
            position: new google.maps.LatLng(lat, lng),
            draggable: drg,
            map: gmap,
            labelContent: label,
            labelAnchor: new google.maps.Point(22, 30),
            labelClass: "labels", // the CSS class for the label
            labelStyle: { opacity: 0.75 }
        });
    }


    if ((tit != null) && (tit != undefined) && (tit != '')) {
        marker.Title = tit;
    }
    // -------
    if ((windowdesc != null) && (windowdesc != undefined) && (windowdesc != '')) {
        marker.addListener('click', function (event) {
            openInfoWindow(event, windowdesc);
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
    gmap_infoWindow = new google.maps.InfoWindow()
}

function openInfoWindow(event, windowdesc) {
    closeInfoWindow();
    gmap_infoWindow.setContent(windowdesc);
    gmap_infoWindow.setPosition(event.latLng);
    gmap_infoWindow.open(gmap);
}

function addInfoWindow(contentString) {
    infoWindow = new google.maps.InfoWindow;
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
    var lable = options['lable'] || '';
    var fit = options['fit'] || false;

    var opacity = 1;

    var symbolStart = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
        strokeColor: '#000',
        fillColor: '#222',
        fillOpacity: 1
    };

    var symbolEnd = {
        path: 'M -2,-2 2,2 M 2,-2 -2,2',
        strokeColor: '#000',
        strokeWeight: 4
    };

    var symbolDash = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
    };

    var ico = null;

    if (dashed == true) {
        opacity = 0;
        ico = [
            {
                icon: symbolDash,
            offset: '0', repeat: '20px'
            }
            ]
    }

    if (direction == true) {
        ico = [
            {   icon: symbolStart,
                offset: '0%'
            },
            {
                icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW },
                offset: '10%', repeat: '50px'
            },
            {
                icon: symbolEnd,
                offset: '100%'
            }
        ]

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
            openInfoWindow(event, windowdesc);
        });
    }


    // ------- lables
    if ((lable != null) && (lable != undefined) && (lable != '')) {
        addLableToline(linecoordinates, lable);
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
    gmap_shaps.push(path)
    return path;
}

function addLableToline(line, lable) {
    var bound = new google.maps.LatLngBounds();
    for (var i = 0; i < line.length; i++) {
        bound.extend(line[i]);
    }

    marker = new MarkerWithLabel({
        position: bound.getCenter(),
        draggable: false,
        map: gmap,
        labelContent: lable,
        labelAnchor: new google.maps.Point(100, 0),
        icon:{ url: "../Content/img/pin/center.png", size: new google.maps.Size(6, 6), anchor: new google.maps.Point(3, 3) },
        labelClass: "line-labels", // the CSS class for the label
        labelStyle: { opacity: 0.5 }
    });
    gmap_markers.push(marker);
}
// ----------------------------------------------------------
// Polygon
// ----------------------------------------------------------

function addPolygon(opt_options) {

    var options = opt_options || {};
    var linecoordinates = options['line'] || [];
    var color = options['color'] || '#000000';
    var fillcolor = options['fillcolor'] || '#ff1100';
    var weight = options['weight'] || 2;
    var windowdesc = options['windowdesc'] || '';
    var movingshape = options['movingshape'] || false;
    var lable = options['lable'] || '';
    var fit = options['fit'] || false;

    var polygon = new google.maps.Polygon({
        path: linecoordinates,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillcolor,
        fillOpacity: 0.35
    });
    polygon.setMap(gmap);
    // --------
    if ((windowdesc != null) && (windowdesc != undefined) && (windowdesc != '')) {
        polygon.addListener('click', openInfoWindow);
    }
    // ------- lables
    if ((lable != null) && (lable != undefined) && (lable != '')) {
        addLableToline(linecoordinates, lable);
    }
    // --------
    if (movingshape == true) {
        gmap_moving_shape = polygon;
    }
    if (fit == true) {
        gmap_shaps.push(polygon)
    }
    for (var i = 0; i < linecoordinates.length; i++) {
        gmap_bounds.extend(linecoordinates[i]);
    }
}
// ----------------------------------------------------------
// Moving shape
// ----------------------------------------------------------
function refreshMovingShape(line) {
    if (gmap_moving_shape) {
        gmap_moving_shape.setPath(line);
    }

}