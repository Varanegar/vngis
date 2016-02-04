var my_markers = [];
var new_id = 0;
$(function() {

 $("#ddl_distribut_road").change(function() {
        var Value = $(this).val();
        $("#Road_List").removeClass("hidden");

        var grid = $("#Road_List").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: "/Road/GetRoadList",
                        type: "POST",
                        data: { id: Value }
                    },
                },

                pageSize: 20,
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
                    title: 'ناحیه',
                }, {
                    field: "",
                    title: '',
                    template: "<a ><i class='glyphicon glyphicon-pencil'></i><a>"
                }, {
                    field: "",
                    title: '',
                    template: "<a ><i class='glyphicon glyphicon-remove Color-Red'></i></a>"
                },
            ]
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
    $("#Report_Map").show();
    new $.jmelosegui.GoogleMap('#mapContainer').ajax({
        url: 'GooglemapRoadView',
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

