var my_markers = [];
var new_id = 0;
$(document).ready(function () {

    $("#pnl_Area2").hide();
    $("#pnl_Area3").hide();
    $("selected_type").val(1);//area1
    var grid = $("#grid_area1").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Area/GetAreaList1",
                    type: "POST"
                },
            },
            pageSize: 30,
            serverPaging: true,
            //serverFiltering: true,
            //serverSorting: true
        },

        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,
        change: grid_change,
        columns: [{
            field: "Text",
            title: 'حوزه',
            
        }, {
            field: '',
            title: '',
            width:15,
            template: "<button id='btn_show_aray2' class='btn btn-default'><i class='glyphicon glyphicon-zoom-in'></i></button>"
        }
        ]
    });


    $("#btn_save").on("click", function (e) {
        e.preventDefault();

        //var map = new GMap(document.getElementById("map_canvas")); 
        //var markers = $('#map').markers;

        var _id = $("#selected_id").val();
        $.ajax({
            type: "POST",
            url: "/Area/SaveAreaPoint",
            dataType: "json",
            data: { id: _id, markers: my_markers },
            success: function (data) {
                grid_change();
            }
        })
       .done(function (Result) {
       });


    });

    $("#btn_show_aray2").on("click", function (e) {
        e.preventDefault();
        $("#pnl_Area1").hide(1500);
        $("#pnl_Area2").show(2000);

        //var map = new GMap(document.getElementById("map_canvas")); 
        //var markers = $('#map').markers;

        var _id = $("#selected_id").val();
        $.ajax({
            type: "POST",
            url: "/Area/GetAreaList2",
            dataType: "json",
            data: { id: _id },
            success: function (data) {
                $("#ddl_distribut_area").click();
            }
        })
       .done(function (Result) {
       });


    });


});



function onMapLoadHandler(args) {
    my_markers = [];
    for (var mark in args.markers) {
        my_markers.push({ Id: mark.substring(6), Lat: args.markers[mark].getPosition().lat(), Lng: args.markers[mark].getPosition().lng() });
        //    my_markers.push(args.markers[c].positions.latLng);

    }

}


function grid_change(arg) {
    var selectedData = this.dataItem(this.select());
    $("#selected_id").val(selectedData.Value);

    $("#Report_Map").show();
    new $.jmelosegui.GoogleMap('#mapContainer').ajax({
        url: 'GooglemapAreaView',
        type: "Get",
        data: { id: selectedData.Value },
        success: function (data) {
            //alert('succeded');
        }
    });
};

function onDragEnd(args) {
    var _find = false;
    var _id;

    for (var i = 0; i < my_markers.length; i++) {
        _id = args.id.substring(6);
        if (my_markers[i].Id == _id) {
            my_markers[i].Lat = args.latLng.lat();
            my_markers[i].Lng = args.latLng.lng();
            _find = true;

        }
        if (_find == true) break;
    }
    //if (_find == false) {
    //    _id = args.id.substring(6);
    //    my_markers.push({ Id: args.id, Lat: args.latLng.lat(), Lng: args.latLng.lng() });
    //    alert("not find " + _id);
    //}
}

function addPoint(args) {
    new_id--;
    my_markers.push({ Id: new_id, Lat: args.latLng.lat(), Lng: args.latLng.lng() });

    var marker = new google.maps.Marker({
        Id: "point_" + new_id,
        position: args.latLng,
        map: args.map,
        draggable: true,
        icon: "/Content/img/pin/point.png"
    }).addListener("dragend", function (e) {
        onDragEnd({ id: "point_" + new_id, latLng: e.latLng });
    });

    //Jmelosegui.Mvc.GoogleMap.markerEvents();
    //marker.addListener("OnMarkerDragEnd", onDragEnd);

}