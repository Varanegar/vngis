var my_markers = [];
var new_id = 0;
var selected_id = 0;
$(document).ready(function () {
    $("#pnl_path").hide();
    selected_id = 0;

    $("#grid_area").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Area/GetAreaList",
                    data: aditionaldata,
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
            field: "Title",
            title: 'عنوان',
        }
        //,{
        //field: "Id",
        //title: "&nbsp; &nbsp;",
        //attributes:{style:"width:15px;"},
        //template: "<button  type='button' class='btn btn-default' onclick='show_detail(0);'><span class='glyphicon glyphicon-zoom-in'></span ></button>"
        //}
        ]
    });

    $("#btn_save").on("click", function (e) {
        e.preventDefault();

        //var map = new GMap(document.getElementById("map_canvas")); 
        //var markers = $('#map').markers;

        var _id = selected_id;
        $.ajax({
            type: "POST",
            url: "/Area/SaveAreaPoint",
            dataType: "json",
            data: { id: _id, markers: my_markers },
            success: function (data) {
                refreshmap();
            }
        })
       .done(function (Result) {
       });
    });

    $("#btn_detail").on("click", function (e) {
        if (selected_id > 0)
            show_detail(selected_id);
    });


});

function show_detail(id) {
    $.ajax({
        type: "POST",
        url: "/Area/HasAreaPoint",
        dataType: "json",
        data: { id: id },
        success: function (data) {
            if (data == true) {
                refreshgrid();
                selected_id = 0;
                refreshmap();

            }
            else {
                alert("لطفا محدوده را مشخص کنید!");
            }
        }
    });
};


function aditionaldata() {
    return { parentId: selected_id };
}

function refreshgrid() {
    if (selected_id != 0) {
        $.ajax({
            type: "POST",
            url: "/Area/GetAreaPath",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ id: selected_id }),
            success: function (data) {
                var list = "<button id = 'btn_back_0' class='btn btn-link' onclick='back(0)' > خانه</button>" ;
                for (var i = data.length -1 ; i >= 0 ; i--) {
                    list += "> <button id = 'btn_back_'" + data[i].Id + " class='btn btn-link' onclick='back(" + data[i].Id + ")' >" + data[i].Title + "</button> " ;
                }
                $("#pnl_path").html(list);
                $("#pnl_path").show();
            }
        });

    }
    else {
        $("#pnl_path").hide();
    }
    $('#grid_area').data('kendoGrid').dataSource.read();
    $('#grid_area').data('kendoGrid').refresh();
}

function back(id) {
    selected_id = id;
    refreshgrid();
    selected_id = 0;
    $("#btn_detail").hide();

}
//---------------------------------------------------------------------------------------------------------
// MAP
//---------------------------------------------------------------------------------------------------------
function onMapLoadHandler(args) {
    my_markers = [];
    for (var mark in args.markers) {
        my_markers.push({ Id: mark.substring(6), Lat: args.markers[mark].getPosition().lat(), Lng: args.markers[mark].getPosition().lng() });
        //    my_markers.push(args.markers[c].positions.latLng);

    }
}

function grid_change(arg) {
    var selectedData = this.dataItem(this.select());
    selected_id = selectedData.Id;
    refreshmap();
    if (selected_id == 0) {
        $("#btn_detail").hide();
    }
    else {
        if (selectedData.IsLeaf)
            $("#btn_detail").hide();
        else
            $("#btn_detail").show();
    }
};

function refreshmap() {
    if (selected_id == 0) {
        $("#mapContainer").hide();
    }
    else{
        $("#mapContainer").show();
        new $.jmelosegui.GoogleMap('#mapContainer').ajax({
            url: 'GooglemapAreaView',
            type: "Get",
            data: { id: selected_id, showcust: $("#chk_customer").is(':checked') },
            success: function (data) {
                //alert('succeded');
            }
        });
    }    
}

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