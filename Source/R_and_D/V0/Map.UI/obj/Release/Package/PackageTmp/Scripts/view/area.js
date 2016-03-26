var point_views = [];
var selected_markers = [];
var ctr = false;
var gridchange_flag = true;

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
            transport: {
                read: loadAreaList
            },
            pageSize: 30,
            serverPaging: false,
            //serverFiltering: true,
            //serverSorting: true
        },

        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,
        change: gridChange,
        dataBound: firstRowSelect,
        columns: [{
            field: "Title",
            title: 'عنوان',
        }

        ,{
            field: "Id",
            title: "&nbsp; &nbsp;",
            attributes:{style:"width:60px;"},
            template: 
                "<button  type='button' class='btn-link btn-grid' onclick='editArea()';><span class='glyphicon glyphicon-pencil color-gray'></span ></button>" +
                "<button  type='button' class='btn-link btn-grid' onclick='removeArea()';><span class='glyphicon glyphicon-trash color-gray'></span ></button>"
          }
            ,{
                field: "IsLeaf",
                title: "&nbsp; &nbsp;",
                attributes:{style:"width:15px;"},
                //hidden: "#=IsLeaf == true#",
                template: "<button  type='button' class='btn-link btn-grid' onclick=showDetail('#=Id#');><span class='glyphicon glyphicon-zoom-in color-gray'></span ></button>"
              }               
        
        ]
    });

    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });

    $("#btn_save").on("click", function (e) {
        e.preventDefault();
        var _id = selected_id;
        $.ajax({
            type: "POST",
            url: url_savepoints,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ Id: _id, Points: point_views }),
            success: function (data) {
                refreshMap(false);
            }
        })
       .done(function (Result) {
       });
    });

    $("#btn_detail").on("click", function (e) {
        if (selected_id !=  null)
            showDetail(selected_id);
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
                    read: loadNotSelectedCustomer
                },
                pageSize: 30,
                serverPaging: false,
                //serverFiltering: true,
                //serverSorting: true
            },

            sortable: false,
            editable: false,
            selectable: "row",
            pageable: false,
            scrollable: true,
            columns: [
                {
                    field: "Id",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    //attributes: { style: "width:15px;" },
                    template: "<button  type='button' class='btn-link btn-grid' onclick=addToSelected('#=Id#'); ><span class='glyphicon glyphicon-chevron-down color-gray'></span ></button>"
                },
                {   field: "Code", title: "کد",   width: 100,     },
                {   field: "Title", title: "عنوان"     },
                {   field: "Phone",  title: "تلفن", width: 100 },
                {   field: "ShopTitle", title: "فروشگاه", width: 100, },
                {   field: "Address", title: "آدرس" },
            ]
        });
        $("#grid_customer_selected").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: loadSelectedCustomer
                },
                pageSize: 30,
                serverPaging: false,
                //serverFiltering: true,
                //serverSorting: true
            },

            sortable: false,
            editable: false,
            selectable: "row",
            pageable: false,
            scrollable: true,
            columns: [
                {
                    field: "Id",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    template: "<button  type='button' class='btn-link btn-grid' onclick=removeFromSelected('#=Id#'); ><span class='glyphicon glyphicon-chevron-up color-gray'></span ></button>"
                },
                { field: "Code", title: "کد", width: 100, },
                { field: "Title", title: "عنوان" },
                { field: "Phone", title: "تلفن", width: 100 },
                { field: "ShopTitle", title: "فروشگاه", width: 100, },
                { field: "Address", title: "آدرس" },
            ]
        });

    });
    
    $("#btn_add_customer_list").on("click", function (e) {
       for (var i = 0; i < selected_markers.length; i++) {
           addToSelected(selected_markers[i].marker.Id.substring(selected_markers[i].marker.Id.lastIndexOf('_') + 1), true);
       }
    });

    $("#btn_remove_customer_list").on("click", function (e) {
        for (var i = 0; i < selected_markers.length; i++) {
            removeFromSelected(selected_markers[i].marker.Id.substring(selected_markers[i].marker.Id.lastIndexOf('_') + 1), true);
        }
    });

});

function firstRowSelect(e) {
    e.sender.select("tr:eq(1)");
};

//$("#btn_edit").on("click", function (e) {
function editArea() {
    if (selected_id != null)
        refreshMap(true);
};

function removeArea() {
    if (selected_id != null)
        $.ajax({
            type: "POST",
            url: url_removepointsbyareaid,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ Id: selected_id }),
            success: function (data) {
                if (data.success == true) {
                    refreshMap(false);
                }
                else {
                    alert('محدوده مورد نظر دارای زیر شاخه می باشد. امکان حذف وجود ندارد.');
                }
            }
        });
};

function showDetail(id) {
    $.ajax({
        type: "POST",
        url: url_haspoint,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ Id: id }),
        success: function (data) {
            if (data == true) {
                refreshGrid();
            }
            else {
                alert("لطفا محدوده را مشخص کنید!");
            }
        }
    });
};




function loadAreaList(options) {
    $.ajax({
        type: "POST",
        url: url_loadarealist,
        data: JSON.stringify({ Id: selected_id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            options.success(result);
        }
    });
}


function loadNotSelectedCustomer(options) {
    $.ajax({
        type: "POST",
        url: url_loadnotselectedcustomer,
        data: JSON.stringify({ Id: selected_id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            options.success(result);
        }
    });
}


function loadSelectedCustomer(options) {
    $.ajax({
        type: "POST",
        url: url_loadselectedcustomer,
        data: JSON.stringify({ Id: selected_id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            options.success(result);
        }
    });
}

function refreshGrid() {
    if (selected_id != null) {
        $.ajax({
            type: "POST",
            url: url_getareapath,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Id: selected_id }),
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
    gridchange_flag = false;
    $('#grid_area').data('kendoGrid').dataSource.read();
    $('#grid_area').data('kendoGrid').refresh();
    gridchange_flag = true;
}

function back(id) {
    selected_id = id;
    refreshGrid();
}



function gridChange(arg) {
    if (gridchange_flag == true) {
        var selectedData = this.dataItem(this.select());
        if (selected_id != selectedData.Id) {
            selected_id = selectedData.Id;
            refreshMap(false);
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
    }
};




//---------------------------------------------------------------------------------------------------------
// Cutomer
//---------------------------------------------------------------------------------------------------------

function emptySelectedMarkers(reverticon) {
    if (reverticon)
        for (var i = 0; i < selected_markers.length; i++) {
            selected_markers[i].marker.setIcon(selected_markers[i].oldicon);
        }
    selected_markers = [];
    $("#btn_add_customer_list").hide();
    $("#btn_remove_customer_list").hide();
}

function onCustomerMarkerClick(marker) {
    if (!ctr) {
        emptySelectedMarkers(true);
    }

    if ((marker.icon.url.indexOf("customerselected") < 0) && (marker.icon.url.indexOf("customer2") < 0)) {
        selected_markers.push({ marker: marker, oldicon: marker.icon });
        marker.setIcon({ url: "../Content/img/pin/customerselected.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });

        if (selected_markers.length > 1) {
            $("#btn_add_customer_list").show();
            $("#btn_remove_customer_list").show();
        }
    }

}

function addToSelected(id, changeicon) {
    $.ajax({
        type: "POST",
        url: url_addcustomertoselected,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CustomerId: id, AreaId: selected_id }),
        success: function (data) {
            if (changeicon) {
                var _index = findCustomerMarkerIndex(id)
                if (_index > -1) {
                    var mrk = selected_markers[_index].marker;
                    mrk.setIcon({ url: "../Content/img/pin/customer1.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
                    selected_markers.splice(_index, 1);
                }
            }
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    });
}


function removeFromSelected(id, changeicon) {
    $.ajax({
        type: "POST",
        url: url_removecustomerfromselected,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ customerId: id, areaId: selected_id }),
        success: function (data) {
            if (changeicon) {
                var _index = findCustomerMarkerIndex(id)
                if (_index > -1) {
                    var mrk = selected_markers[_index].marker;
                    mrk.setIcon({ url: "../Content/img/pin/customer0.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
                    selected_markers.splice(_index, 1);
                }
            }
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    });
}

function findCustomerMarkerIndex(id) {
    for (var i = 0; i < selected_markers.length; i++) {
        if (selected_markers[i].marker.Id == "customer_point_"+id) {
            return i;
        }
    }
    return -1;
}
//---------------------------------------------------------------------------------------------------------
//point
//---------------------------------------------------------------------------------------------------------
function removePoint(id) {
    var index = findPointMarkerIndex(id);
    if (index > -1) {
        point_views.splice(index, 1);
        removeMarkerById("point_"+id);
        refreshAreaLine();
    }

}

function addPointByBtn(id) {
    var index = findPointMarkerIndex(id);

    if (index > -1) {
        var point = point_views[index];                
        addNewPoint(parseInt(point.Pr) + 1, point.Lat - 0.02, point.Lng - 0.02);
        closeInfoWindow();

        for (var i = index + 1; i < point_views.length - 2; i++) {
            point_views[i].Pr++;
        }
        var p = point_views[point_views.length-1];

        point_views.splice(point_views.length - 1, 1);
        point_views.splice(index+1, 0, p);

        point_views.sp
        refreshAreaLine();
    }
}


function addPointByClick(args) {
    addNewPoint(-1, args.latLng.lat(), args.latLng.lng());
    refreshAreaLine();
}


function addPoint(id, pr, lat, lng) {
    var _m = addMarker({
        id: "point_" + id,
        lat: lat, lng: lng, tit: pr, draggable: true,
        windowdesc: "<br/>" +
                     //   "<h1>اولویت : " + pr + "</h1>" +
                     //"<br />" +
                     "<button id='btn_add_point_' onclick=addPointByBtn('" + id + "') class='btn btn-default'>افزودن</button>" +
                     "<button id='btn_remove_point_' onclick=removePoint('" + id + "') class='btn btn-default'>حذف</button>",
        clustering: false
    });
    _m.setIcon({ url: "../Content/img/pin/point.png", size: new google.maps.Size(10, 10), anchor: new google.maps.Point(5, 5) })
    _m.addListener("dragend", function (e) {
        onDragEnd({ id: id, latLng: e.latLng });
    });
    var _id;
    _id = id.substring(id.lastIndexOf('_') + 1);

    point_views.push({ Id: _id, Lat: lat, Lng: lng, Pr: pr });
    return _m;
}

function refreshAreaLine() {
    var line = [];
    $.each(point_views, function (i, item) {
        line.push(new google.maps.LatLng(item.Lat, item.Lng));
    });    
    refreshMovingShape(line);
}

function addNewPoint(pr, lat, lng) {
    new_id++;
    var guid = get_temp_guid(new_id);
    if (pr == -1) { pr = new_id; }

    addPoint(guid, pr, lat, lng)
}
//---------------------------------------------------------------------------------------------------------
// MAP
//---------------------------------------------------------------------------------------------------------
function refreshMap(edit) {
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

        var grid = $("#grid_area").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());
        var isleaf = selectedItem.IsLeaf;

        clearOverlays();
        point_views = [];
        new_id = 0;
        if (edit) addListener('click', addPointByClick);
        else removeListener('click');

        drawAreaParentLine();

        if (edit) {
            drawAreaSibilingLine();
        }
        else {
            if (!isleaf)
            drawAreaChildLine();
        }
        drawAreaCustomerPoints(edit, isleaf);

        drawAreaLinePoints(edit, isleaf);
    }
}
function drawAreaParentLine() {
    $.ajax({
        type: "POST",
        url: url_loadareaparentpoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            var arealine = [];
            if ((data != null) && (data.Points != null)) {

                $.each(data.Points, function (i, item) {
                    arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                });
                if (arealine.length > 0) {
                    addPolyline({ line: arealine, color: '#001100' });
                    fitPointBounds();
                }
            }
        }
    });
}

function drawAreaSibilingLine(){
    $.ajax({
        type: "POST",
        url: url_loadareasibilingpoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            if (data != null) {
                $.each(data, function (i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function (j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777' });
                    }
                })
            }
        }
    });
}

function drawAreaChildLine(){
    $.ajax({
        type: "POST",
        url: url_loadareachildgpoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            if (data != null)  {
                $.each(data, function (i, line) {
                    var arealine = [];
                    if (line.Points != null)
                    $.each(line.Points, function (j, item) {
                        arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                    });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777' });
                    }
                })
            }
        }
    });
}

function getCustomerWindowBtn(id, typ) {
    var _btn = '';

    if (typ == 1) {//PointType.CustomerRout
        _btn =  "<!-- CUSTOMER BTN --> " +
                "<br />" +
                "<button id='btn_remove_customer_' onclick='removeFromSelected(\"" + id + "\", true)' class='btn btn-default'>حذف از مسیر</button>"
    }
    else if (typ == 0) { //PointType.CustomerWithoutRout
        _btn = "<!-- CUSTOMER BTN --> " +
               "<br />" +
               "<button id='btn_add_customer_' onclick='addToSelected(\"" + id + "\", true)' class='btn btn-default'>اضافه به مسیر</button>"
    }

    return _btn;

}

function drawAreaCustomerPoints(edit, isleaf) {

    if (isleaf) {
        var showcustrout = $("#chk_customer_route").is(':checked');
        var showcustotherrout = $("#chk_customer_other_route").is(':checked');
        var showcustwithoutrout = $("#chk_customer_without_route").is(':checked');

        if (showcustrout || showcustotherrout || showcustwithoutrout)
        $.ajax({
            type: "POST",
            url: url_loadarealeafcustomerpoints,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({  Id: selected_id,
                                    Showcustrout: showcustrout,
                                    Showcustotherrout: showcustotherrout,
                                    Showcustwithoutrout: showcustwithoutrout
                                }),
            success: function (data) {
                $.each(data, function (i, item) {
                    var desc = '';
                    if (edit) {
                        desc = item.Desc + getCustomerWindowBtn(item.Id, item.PointType);
                    }
                    else {
                        desc = item.Desc;
                    }
                    var _m = addMarker({
                        id: "customer_point_" + item.Id,
                        lat: item.Latitude, lng: item.Longitude,
                        draggable: false, windowdesc: desc, clustering: false
                    });
                    _m.setIcon({ url: "../Content/img/pin/customer" + item.PointType + ".png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
                    if (edit && isleaf)
                        _m.addListener('click', function (e) { onCustomerMarkerClick(_m)});

                });
            }
        });

        }
    else {
        if ($("#chk_customer").is(':checked')) {
            $.ajax({
                type: "POST",
                url: url_loadareacustomerpoints,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ Id: selected_id }),
                success: function (data) {
                    $.each(data, function (i, item) {
                        var m = addMarker({
                            id: "customer_point_" + item.Id,
                            lat: item.Latitude, lng: item.Longitude, draggable: false,
                            windowdesc: item.Desc, clustering: true
                        });
                        m.setIcon({ url: "../Content/img/pin/customer" + item.PointType + ".png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) })
                    });
                }
            });
            renderClusterMarkers();
        }

    }
}

function drawAreaLinePoints(edit, isleaf) {
    $.ajax({
        type: "POST",
        url: url_loadareapoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            var arealine = [];
            if ((data != null) && (data.Points != null)) {
                $.each(data.Points, function (i, item) {
                    if (edit) {
                        m = addPoint(item.Id, item.Lable, item.Latitude, item.Longitude);
                        new_id = item.Lable;
                    }
                    arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                });
                if (arealine.length > 0) {
                    if (isleaf)
                        addPolyline({line:arealine, color:data.Color, weight:3, windowdesc:data.Desc, movingshape:true});
                    else
                        addPolygon({ line: arealine, color: data.Color, weight: 3, windowdesc: data.Desc, movingshape: true });

                    fitPointBounds();
                }

            }
        }
    });
}


function onDragEnd(args) {
    var index = findPointMarkerIndex(args.id);
    if (index > -1) {
        point_views[index].Lat = args.latLng.lat();
        point_views[index].Lng = args.latLng.lng();
    }
    refreshAreaLine();
}

function findPointMarkerIndex(id) {
    var _id;
    _id = id.substring(id.lastIndexOf('_') + 1);

    for (var i = 0; i < point_views.length; i++) {
        if (point_views[i].Id == _id) {
            return i
        }
    }
    return -1
}




window.onkeydown = function(e) {
    ctr = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true));
};
window.onkeyup = function(e) {
    ctr = false;
};