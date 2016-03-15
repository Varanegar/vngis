var point_markers = [];
var selected_markers = [];
var ctr = false;

var new_id = 0;
var selected_id = null;
$(document).ready(function () {
    $("#btn_set_customer").hide();
    $("#btn_map").hide();
    $("#btn_add_customer_list").hide();
    $("#btn_remove_customer_list").hide();
    $("#btn_save").hide();
    
    $("#div_leaf_customer").hide();

    selected_id = null;

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
        ,{
            field: "Id",
            title: "&nbsp; &nbsp;",
            attributes:{style:"width:15px;"},
            template: "<button  type='button' class='btn btn-link' onclick=show_detail('#=Id#');><span class='glyphicon glyphicon-zoom-in color-gray'></span ></button>"
        }
        , {
            field: "Id",
            title: "&nbsp; &nbsp;",
            attributes: { style: "width:15px;" },
            template: "<button  type='button' class='btn btn-link' onclick='edit_area()';><span class='glyphicon glyphicon-pencil color-gray'></span ></button>"
        }
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
            data: { id: _id, markers: point_markers },
            success: function (data) {
                refreshmap(false);
            }
        })
       .done(function (Result) {
       });
    });

    $("#btn_detail").on("click", function (e) {
        if (selected_id !=  null)
            show_detail(selected_id);
    });


    $("#btn_map").on("click", function (e) {
        $("#mapContainer").show(1000);
        $("#customerContainer").hide(1000);
        $("#btn_set_customer").show();
        $("#btn_map").hide();
    });

    $("#btn_set_customer").on("click", function (e) {
        $("#mapContainer").hide(1000);
        $("#customerContainer").show(1000);
        $("#btn_set_customer").hide();
        $("#btn_map").show();
        

        $("#grid_customer_not_selected").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: "/Area/GetNotSelectedCustomer",
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
            columns: [{
                field: "Title",
                title: 'عنوان',
            }
            ,{
                field: "Id",
                title: "&nbsp; &nbsp;",
                attributes:{style:"width:15px;"},
                template: "<button  type='button' class='btn btn-default'  onclick=add_to_selected('#=Id#');><span class='glyphicon glyphicon-chevron-left'></span ></button>"
            }
            ]
        });
        $("#grid_customer_selected").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: "/Area/GetSelectedCustomer",
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
            columns: [{
                field: "Title",
                title: 'عنوان',
            }
            , {
                field: "Id",
                title: "&nbsp; &nbsp;",
                attributes: { style: "width:15px;" },
                template: "<button  type='button' class='btn btn-default' onclick=remove_from_selected('#=Id#'); ><span class='glyphicon glyphicon-chevron-right'></span ></button>"
            }
            ]
        });

    });
    

    $("#btn_add_customer_list").on("click", function (e) {
       for (var i = 0; i < selected_markers.length; i++) {
           add_to_selected(selected_markers[i].marker.id.substring(selected_markers[i].marker.id.lastIndexOf('_') + 1), false);
           selected_markers[i].marker.marker.setIcon("../Content/img/pin/customer1.png");
       }
       empty_selected_markers(false);
    });

    $("#btn_remove_customer_list").on("click", function (e) {
        for (var i = 0; i < selected_markers.length; i++) {
            remove_from_selected(selected_markers[i].marker.id.substring(selected_markers[i].marker.id.lastIndexOf('_') + 1), false);
            selected_markers[i].marker.marker.setIcon("../Content/img/pin/customer0.png");
        }
        empty_selected_markers(false);
    });

});


//$("#btn_edit").on("click", function (e) {
function edit_area() {
    if (selected_id != null)
        refreshmap(true);
};

function show_detail(id) {
    $.ajax({
        type: "POST",
        url: "/Area/HasAreaPoint",
        dataType: "json",
        data: { id: id },
        success: function (data) {
            if (data == true) {
                refreshgrid();
                selected_id = null;
                refreshmap(false);

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
    if (selected_id != null) {
        $.ajax({
            type: "POST",
            url: "/Area/GetAreaPath",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ id: selected_id }),
            success: function (data) {
                var list = "<button id = 'btn_back_0' class='btn btn-link color-gray' onclick='back(0)' > خانه</button>";
                for (var i = data.length -1 ; i >= 0 ; i--) {
                    list += ">> <button id = 'btn_back_'" + data[i].Id + " class='btn btn-link color-gray' onclick=back('" + data[i].Id + "') >" + data[i].Title + "</button> ";
                }
                $("#pnl_path").html(list);
            }
        });

    }
    else {
        $("#pnl_path").html("");
    }
    $('#grid_area').data('kendoGrid').dataSource.read();
    $('#grid_area').data('kendoGrid').refresh();
}

function back(id) {
    selected_id = id;
    refreshgrid();
    selected_id = null;
    $("#btn_detail").hide();

}



function grid_change(arg) {
    var selectedData = this.dataItem(this.select());
    if (selected_id != selectedData.Id) {
        selected_id = selectedData.Id;
        refreshmap(false);
        if (selected_id == null) {
            $("#btn_detail").hide();
            $("#btn_edit").hide();
        }
        else {
            $("#btn_edit").show();
            if (selectedData.IsLeaf) {
                $("#btn_detail").hide();
                $("#btn_set_customer").show();
                $("#btn_map").hide();
                $("#div_customer").hide();
                $("#div_leaf_customer").show();
            } else {
                $("#btn_set_customer").hide();
                $("#btn_detail").show();
                $("#btn_map").hide();
                $("#div_customer").show();
                $("#div_leaf_customer").hide();
            }
        }
    }
};

function refreshmap(edit) {
    if (selected_id == null) {
        $("#mapContainer").hide();
        $("#btn_save").hide();
    }
    else {
        $("#mapContainer").show();
        if (edit == true)
            $("#btn_save").show();
        else
            $("#btn_save").hide();

        new $.jmelosegui.GoogleMap('#mapContainer').ajax({
            url: 'GooglemapAreaView',
            type: "Get",
            data: {
                id: selected_id, editable: edit,
                showcust: $("#chk_customer").is(':checked'), 
                showcustrout: $("#chk_customer_route").is(':checked'),
                showcustotherrout: $("#chk_customer_other_route").is(':checked'),
                showcustwithoutrout: $("#chk_customer_without_route").is(':checked'),
            },
            success: function (data) {
                
                //alert('succeded');
            }
        });
    }
}

//---------------------------------------------------------------------------------------------------------
// Cutomer
//---------------------------------------------------------------------------------------------------------

function add_to_selected(id, changeicon) {
    $.ajax({
        type: "POST",
        url: "/Area/AddCustomerToSelected",
        dataType: "json",
        data: { customerId: id, areaId: selected_id },
        success: function (data) {
            if (changeicon) {
                var mrk = find_customer_marker(id);
                if (mrk != null)
                    mrk.marker.setIcon("../Content/img/pin/customer1.png");
            }
            $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
            $('#grid_customer_not_selected').data('kendoGrid').refresh();
            $('#grid_customer_selected').data('kendoGrid').dataSource.read();
            $('#grid_customer_selected').data('kendoGrid').refresh();
        }
    });
}


function remove_from_selected(id, changeicon) {
    $.ajax({
        type: "POST",
        url: "/Area/RemoveCustomerFromSelected",
        dataType: "json",
        data: { customerId: id, areaId: selected_id },
        success: function (data) {
            if (changeicon) {
                var mrk = find_customer_marker(id);
                if (mrk != null)
                    mrk.marker.setIcon("../Content/img/pin/customer0.png");
                
            }
            $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
            $('#grid_customer_not_selected').data('kendoGrid').refresh();
            $('#grid_customer_selected').data('kendoGrid').dataSource.read();
            $('#grid_customer_selected').data('kendoGrid').refresh();
        }
    });
}

function find_customer_marker(id) {
    for (var i = 0; i < selected_markers.length; i++) {
        if (selected_markers[i].marker.id == "customer_point_"+id) {
            return selected_markers[i].marker;
        }
    }
    return null;
}
//---------------------------------------------------------------------------------------------------------
//point
//---------------------------------------------------------------------------------------------------------
function change_priority_point(id) {
}

function remove_point(id) {
}
//---------------------------------------------------------------------------------------------------------
// MAP
//---------------------------------------------------------------------------------------------------------
function onMapLoadHandler(args) {
    point_markers = [];
    new_id = 0;
    for (var mark in args.markers) {
        if (mark.indexOf("customer_point_") < 0) {
            point_markers.push({
                Id: mark.substring(mark.lastIndexOf('_') + 1),
                Lat: args.markers[mark].getPosition().lat(),
                Lng: args.markers[mark].getPosition().lng(),
                Pr: parseInt(args.markers[mark].title)
            });
            args.markers[mark].setLabel(args.markers[mark].title);
        }
        new_id = parseInt(args.markers[mark].title); //priority
    }
    
}

function empty_selected_markers(reverticon) {
    if (reverticon)
    for (var i = 0; i < selected_markers.length; i++) {
        selected_markers[i].marker.marker.setIcon(selected_markers[i].oldicon);
    }
    selected_markers = [];
    $("#btn_add_customer_list").hide();
    $("#btn_remove_customer_list").hide();
}

function onClick(args) {
    if ((args.marker.icon.url.indexOf("customerselected") < 0) && (args.marker.icon.url.indexOf("customer2") < 0)) {
        if (!ctr) {
            empty_selected_markers(true);
        }
        selected_markers.push({ marker: args, oldicon:args.marker.icon});
        args.marker.setIcon({ url: "../Content/img/pin/customerselected.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
        
        if (selected_markers.length > 1) {
            $("#btn_add_customer_list").show();
            $("#btn_remove_customer_list").show();            
        }
    }

}

function onDragEnd(args) {
    var _find = false;
    var _id;

    _id = args.id.substring(args.id.lastIndexOf('_')+1);

    for (var i = 0; i < point_markers.length; i++) {
        if (point_markers[i].Id == _id) {
            point_markers[i].Lat = args.latLng.lat();
            point_markers[i].Lng = args.latLng.lng();
            _find = true;
        }
        if (_find == true) break;
    }    
}

function addPoint(args) {
    new_id++;
    var guid = get_temp_guid(new_id);
    point_markers.push({ Id: guid, Lat: args.latLng.lat(), Lng: args.latLng.lng(), Pr: new_id });

    var marker = new google.maps.Marker({
        Id: "point_" + guid,
        position: args.latLng,
        map: args.map,
        draggable: true,
        label: new_id.toString(),
        labelClass: 'labels',
        labelAnchor: new google.maps.Point(22, 0),
        icon: "/Content/img/pin/point.png",
        }).addListener("dragend", function (e) {
        onDragEnd({ id: "point_" + guid, latLng: e.latLng });
    });
}



window.onkeydown = function(e) {
    ctr = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true));
};
window.onkeyup = function(e) {
    ctr = false;
};