var point_views = [];
var customer_views = [];
var selected_markers = [];
var ctr = false;
var gridchange_flag = true;
var customerLoad = false;
var new_id = 0;
var selected_id = null;


$(document).ready(function () {
    $("#btn_set_customer").hide();
    $("#btn_map").hide();
    $("#btn_add_customer_list").hide();
    $("#btn_remove_customer_list").hide();
    $("#btn_save").hide();
    $("#customerContainer").hide();
    $("#div_leaf_customer").hide();
    $("#mapContainer").show();

    selected_id = null;

    $("#grid_area").kendoGrid({
        dataSource: {
            transport: { read: loadAreaList, },
            pageSize: 30,
            serverPaging: false,
            //serverFiltering: true,
            //serverSorting: true
        },
        height:550,
        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: true,
        change: gridChange,
        dataBound: firstRowSelect,
        columns: [{ field: "Title", title: 'عنوان' }

        , {
            field: "Id",
            title: "&nbsp; &nbsp;",
            attributes: { style: "width:90px;" },
            template:
                "<button  type='button' class='btn-link btn-grid' onclick='editArea()';><span class='glyphicon glyphicon-pencil color-gray span-btn-grid'></span ></button>" +
                "<button  type='button' class='btn-link btn-grid' onclick='removeArea()';><span class='glyphicon glyphicon-trash color-gray span-btn-grid'></span ></button>" +
                "<button  value='#=IsLeaf#' type='button' class='btn-link btn-grid btn-detail' onclick=showDetail('#=Id#');><span class='glyphicon glyphicon-zoom-in color-gray span-btn-grid'></span ></button>"
        }
        , { field: "IsLeaf", hidden: true, }
        ]
    });

    $('#customer').kendoAutoComplete({
        dataTextField: 'CustomerName',
        filter: 'contains',
        placeholder: 'مشتری را انتخاب کنید...',
        minLength: 3,
        width:300,
        dataSource: {
            serverFiltering: true,
            //serverPaging: true,
            transport: { read: loadCustomerAutoComplete }
        },
        select: function (e) {
            
            var dataItem = this.dataItem(e.item.index());
            
            if ((dataItem != null) && (dataItem != undefined)) {
                if (dataItem.HasLatLng == true)
                    alert('مکان مشتری مورد نظر قبلا مشخص شده است، در صورت ذخیره اطلاعات جدید، مکان قبلی مشتری اصلاح خواهد شد.');
                $("#dlg_customer_hdn_id").val(dataItem.Id);

            }
            else
                $("#dlg_customer_hdn_id").val('');

            // Use the selected item or its text
        }
    });

    initMap('mapContainer', { lng: 46.293039, lat: 38.0732100 });



    $("#btn_customer_save").on("click", function (e) {
        saveCustomerPositions(false);
    });

    $("#btn_save").on("click", function (e) {
        saveCustomerPositions(true);
    });

    $("#btn_cancel").on("click", function (e) {
        refreshMap(false);
    });

    $("#btn_detail").on("click", function (e) {
        if (selected_id != null)
            showDetail(selected_id);
    });

    $("#btn_map").on("click", function (e) {
        $("#mapContainer").show(1000);
        $("#customerContainer").hide(1000);
        $("#btn_set_customer").show();
        $("#btn_map").hide();
        refreshMap(false);
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
                pageSize: 5,
                serverPaging: false,
                //serverFiltering: true,
                //serverSorting: true
            },

            sortable: false,
            editable: false,
            selectable: "row",
            pageable: {
                // we don't set any DataSource here
                pageSize: 5
            },
            scrollable: true,
            filterable: {
                mode: "row"
            },
            columns: [
                {
                    field: "Id",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    filterable: false,
                    //attributes: { style: "width:15px;" },
                    template: "<button  type='button' class='btn-link btn-grid' onclick=addToSelectedBtn('#=Id#'); ><span class='glyphicon glyphicon-chevron-down color-gray'></span ></button>"
                },
                { field: "Code", title: "کد", width: 100, },
                { field: "Title", title: "نام مشتری" },
                { field: "Phone", title: "تلفن", width: 100 },
                { field: "ShopTitle", title: "فروشگاه", width: 100, },
                { field: "Activity", title: "فعالیت", width: 100, },
                { field: "Address", title: "آدرس" },
            ]
        });

        $("#grid_customer_selected").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: loadSelectedCustomer
                },
                pageSize: 5,
                serverPaging: false,
                //serverFiltering: true,
                //serverSorting: true
            },

            sortable: false,
            editable: false,
            selectable: "row",
            pageable: true,
            scrollable: true,
            filterable: {
                mode: "row"
            },

            columns: [
                {
                    field: "Id",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    filterable: false,
                    template: "<button  type='button' class='btn-link btn-grid' onclick=removeFromSelectedBtn('#=Id#'); ><span class='glyphicon glyphicon-chevron-up color-gray'></span ></button>"
                },
                { field: "Code", title: "کد", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "Title", title: "نام مشتری", filterable: { cell: { operator: "contains" } } },
                { field: "Phone", title: "تلفن", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "ShopTitle", title: "فروشگاه", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "Activity", title: "فعالیت", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "Address", title: "آدرس", filterable: { cell: { operator: "contains" } } },
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

    $("#btn_add_new_customer").on("click", function (e) {
        refreshMapForCustomer();
    });

    $("#chk_customer_without_route").on("change", function (e) {
        refreshMap(false);
    });
    $("#chk_customer_other_route").on("change", function (e) {
        refreshMap(false);
    });
    $("#chk_customer_route").on("change", function (e) {
        refreshMap(false);
    });
    $("#chk_customer").on("change", function (e) {
        refreshMap(false);
    });

    $("#btn_save_customer_position").on("click", function (e) {
        
        var lat = $("#dlg_customer_hdn_lat").val();
        var lng = $("#dlg_customer_hdn_lng").val();
        var id = $("#dlg_customer_hdn_id").val();
        var pointid = $("#dlg_customer_hdn_point_id").val();

        if ((id == null) || (id == undefined) || (id == ''))
            alert('مشتری انتخاب شده معتبر نمی باشد.');
        else
            addCustomerpoint(id, lat, lng, pointid);
        closeCustomerDialog();
    });
});
function savePoints() {
    var id = selected_id;
    $.ajax({
        type: "POST",
        url: url_savepoints,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ Id: id, Points: point_views }),
        success: function (data) {
            refreshMap(false);
        }
    });
}

function saveCustomerPositions(savepoint) {
    savepoint = savepoint || false;
    if (customer_views.length > 0)
        $.ajax({
            type: "POST",
            url: url_savecustomerposition,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(customer_views),
            success: function (data) {
                if (savepoint == true)
                    savePoints();
                else
                    refreshMap(false);
            }
        });
    else {
        if (savepoint == true)
            savePoints();
        else
            refreshMap(false);
    }


}
//--------------------------------------------------------------
// are grid
//--------------------------------------------------------------

function firstRowSelect(e) {
    e.sender.select("tr:eq(1)");
    var details = $('#grid_area .btn-detail');
    for (var i = 0; i < details.length; i++) {
        if (details[i].value.toLowerCase() == "true")
            details[i].hidden = true;
    }

};

function editArea() {
    if (selected_id != null)
        refreshMap(true);
};

function removeArea() {
    if (selected_id != null) {
        var r = confirm("ایا اطلاعات محدوده حذف شود؟");
        if (r == true) {
            $.ajax({
                type: "POST",
                url: url_removepointsbyareaid,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({ Id: selected_id }),
                success: function(data) {
                    if (data.Success == true) {
                        refreshMap(false);
                    } else {
                        alert('محدوده مورد نظر دارای زیر شاخه می باشد. امکان حذف وجود ندارد.');
                    }
                }
            });
        }
    }

};

function showDetail(id) {
    var selectedRowData = getSelectedRow("grid_area");

    if (selectedRowData.IsLeaf == false)
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
            gridchange_flag = true;
            options.success(result);
        }
    });
}

function refreshGrid() {
    gridchange_flag = false;
    if (selected_id != null) {
        $.ajax({
            type: "POST",
            url: url_getareapath,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Id: selected_id }),
            success: function (data) {
                var list = "<button id = 'btn_back_0' class='btn btn-link color-gray' onclick='back(0)' > خانه</button>";
                for (var i = data.length - 1 ; i >= 0 ; i--) {
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

function back(id) {
    selected_id = id;
    refreshGrid();
}

function selectedRowIsLeaf() {
    var grid = $("#grid_area").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());
    if ((selectedItem != undefined) && (selectedItem != null))
        return selectedItem.IsLeaf;
    return false;
}

//---------------------------------------------------------------------------------------------------------
// Cutomer
//---------------------------------------------------------------------------------------------------------
//-----------------------------------------
// auto cpmplete
//-----------------------------------------
function loadCustomerAutoComplete(options) {
    $.ajax({
        type: "POST",
        url: url_vnloadCustomer,
        data: JSON.stringify({ SearchValue: $("#customer").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            options.success(result);
        }
    });

}


//-----------------------------------------
// grid
//-----------------------------------------
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

function addToSelectedBtn(id) {
    $.ajax({
        type: "POST",
        url: url_addcustomertoselected,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CustomerId: id, AreaId: selected_id }),
        success: function (data) {
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    });
}

function removeFromSelectedBtn(id) {
    $.ajax({
        type: "POST",
        url: url_removecustomerfromselected,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ customerId: id, areaId: selected_id }),
        success: function (data) {
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    });
}

//-----------------------------------------
// map
//-----------------------------------------

function emptySelectedMarkers(reverticon) {
    if (reverticon)
        for (var i = 0; i < selected_markers.length; i++) {
            selected_markers[i].marker.setIcon(selected_markers[i].oldicon);
        }
    selected_markers = [];
    $("#btn_add_customer_list").hide();
    $("#btn_remove_customer_list").hide();
}

function onCustomerMarkerClick(e, id, marker, desc, editable) {
    if (!ctr) {
        emptySelectedMarkers(true);
    }
    if (editable == true) {
        var oicon = marker.icon;
        if ((oicon.url.indexOf("customerselected") < 0) && (oicon.url.indexOf("customer2") < 0)) {
            selected_markers.push({ marker: marker, oldicon: oicon });
            marker.setIcon({ url: "../Content/img/pin/customerselected.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });

            if (selected_markers.length > 1) {
                closeInfoWindow();

                $("#btn_add_customer_list").show();
                $("#btn_remove_customer_list").show();
            }
            else {
                var windowdesc = '';
                if (oicon.url.indexOf("customer0") > 0) {
                    windowdesc = "<br />" + desc + "<br />" +
                   "<button id='btn_add_customer_' onclick='addToSelected(\"" + id + "\", true)' class='btn btn-default'>افزودن به مسیر</button>"
                }
                else {
                    windowdesc = "<br />" + desc + "<br />" +
                    "<button id='btn_remove_customer_' onclick='removeFromSelected(\"" + id + "\", true)' class='btn btn-default'>حذف از مسیر</button>"
                }
                openInfoWindow(e, windowdesc);
            }
        }
    }
    else {
        openInfoWindow(e, "<br />" + desc);
    }

}

function findCustomerMarkerIndex(id) {
    for (var i = 0; i < selected_markers.length; i++) {
        if (selected_markers[i].marker.Id == "customer_point_" + id) {
            return i;
        }
    }
    return -1;
}

function addToSelected(id) {
    var _index = findCustomerMarkerIndex(id)
    if (_index > -1) {
        var mrk = selected_markers[_index].marker;
        mrk.setIcon({ url: "../Content/img/pin/customer1.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
        selected_markers.splice(_index, 1);
        closeInfoWindow();
        addNewPoint(-1, mrk.getPosition().lat(), mrk.getPosition().lng(), id);
        refreshAreaLine();
    }
}

function removeFromSelected(id) {
    var _index = findCustomerMarkerIndex(id)
    if (_index > -1) {
        var mrk = selected_markers[_index].marker;
        mrk.setIcon({ url: "../Content/img/pin/customer0.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
        selected_markers.splice(_index, 1);

        var _pointindex = findPointMarkerIndexByCustomer(id);
        if (_pointindex > -1) {
            removeMarkerById("point_" + point_views[_pointindex].Id);
            for (var i = _pointindex; i < point_views.length - 1; i++) {
                point_views[i].Pr = (parseInt(point_views[i].Pr) - 1).toString();
            }
            point_views.splice(_pointindex, 1);
            refreshAreaLable();
            refreshAreaLine();
        }
    }
}

//---------------------------------------------------------------------------------------------------------
//point
//---------------------------------------------------------------------------------------------------------
function removePoint(id) {

    var index = findPointMarkerIndex(id);
    if (index > -1) {
        var pr = parseInt(point_views[index].Pr);
        for (var i = index; i < point_views.length - 1; i++) {
            point_views[i].Pr = (parseInt(point_views[i].Pr) - 1).toString();
        }
        point_views.splice(index, 1);
        removeMarkerById("point_" + id);
        if (new_id == pr) new_id--;

        refreshAreaLable();
        refreshAreaLine();
    }
}

function transformCustomerPoint(id) {

    var index = findPointMarkerIndex(id);
    if (index > -1) {
        if (point_views[index].CstId != '')
            alert('این نقطه قبلا به مشتری تخصیص دادهه شده.');
        else {
            $("#dlg_customer_hdn_id").val('');
            $("#dlg_customer_hdn_point_id").val(id);
            $("#dlg_customer_hdn_lat").val(point_views[index].Lat);
            $("#dlg_customer_hdn_lng").val(point_views[index].Lng);


            $("#dlg_customer").modal('show');
        }
    }
}

function savePoint(id) {
    var index = findPointMarkerIndex(id);
    var newindex = -1;
    var newpr = parseInt($("#txt_priority_" + id).val());
    var oldpr = parseInt(point_views[index].Pr);
    if (oldpr != newpr) {
        if (newpr > oldpr) {
            for (var i = 0; i < point_views.length - 1; i++) {
                if (parseInt(point_views[i].Pr) == newpr)
                    newindex = i;
                if ((parseInt(point_views[i].Pr) > oldpr) && (parseInt(point_views[i].Pr) <= newpr))
                    point_views[i].Pr = (parseInt(point_views[i].Pr) - 1).toString();
                if (parseInt(point_views[i].Pr) > newpr) {
                    if (newindex == -1) newindex = i; //not found new index
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < point_views.length - 1; i++) {
                if (parseInt(point_views[i].Pr) == newpr)
                    newindex = i;
                if ((parseInt(point_views[i].Pr) < oldpr) && (parseInt(point_views[i].Pr) >= newpr)) {
                    if (newindex == -1) newindex = i; //not found new index
                    point_views[i].Pr = (parseInt(point_views[i].Pr) + 1).toString();
                }
                if (parseInt(point_views[i].Pr) > oldpr) break;
            }
        }
        var p = point_views[index];
        if (newindex > -1) {
            p.Pr = newpr.toString();
            point_views.splice(index, 1);
            point_views.splice(newindex, 0, p);
        }
        else {
            p.Pr = parseInt(point_views[point_views.length - 1].Pr) + 1;
            point_views.splice(index, 1);
            point_views.push(p);
        }

        refreshAreaLable();
        refreshAreaLine();

    }
    closeInfoWindow();
}

function addPointByBtn(id) {
    var index = findPointMarkerIndex(id);

    if (index > -1) {
        var point = point_views[index];
        addNewPoint(parseInt(point.Pr) + 1, point.Lat - 0.02, point.Lng - 0.02);
        closeInfoWindow();

        for (var i = index + 1; i < point_views.length - 1; i++) {
            point_views[i].Pr = (parseInt(point_views[i].Pr) + 1).toString();
        }
        var p = point_views[point_views.length - 1];

        point_views.splice(point_views.length - 1, 1);
        point_views.splice(index + 1, 0, p);

        refreshAreaLine();
        refreshAreaLable();
    }
}

function addPointByClick(args) {
    addNewPoint(-1, args.latLng.lat(), args.latLng.lng());
    refreshAreaLine();
}

function addPoint(id, pr, lat, lng, cust) {

    if ((cust == undefined) || (cust == null))
        cust = '';

    var _m = addMarker({
        id: "point_" + id,
        lat: lat, lng: lng, tit: pr, draggable: cust == '', label: pr,
        clustering: false,
    });
    _m.addListener('click', function (event) {
        var index = findPointMarkerIndex(id);
        if (index > -1) {
            var cpr = point_views[index].Pr;

            var transformcustomerbtn = "";
            if (selectedRowIsLeaf() == true)
                transformcustomerbtn = "<button id='btn_customer_transform_point_' onclick=transformCustomerPoint('" + id + "') class='btn btn-default'>تبدیل به مشتری</button>";
            var windowdesc = "<br/>" +
                "<input type='number' id='txt_priority_" + id + "' value=" + cpr + " class='form-control' />" +
                "<br />" +
                "<button id='btn_save_point_' onclick=savePoint('" + id + "') class='btn btn-default'>ذخیره</button>" +
                "<button id='btn_add_point_' onclick=addPointByBtn('" + id + "') class='btn btn-default'>افزودن</button>" +
                "<button id='btn_remove_point_' onclick=removePoint('" + id + "') class='btn btn-default'>حذف</button>" +
                transformcustomerbtn;

            openInfoWindow(event, windowdesc);

        }
    });



    if (cust != undefined && cust != null && cust != '') { // customer point
        _m.setIcon({ url: "../Content/img/pin/point.png", size: new google.maps.Size(1, 1), anchor: new google.maps.Point(0, 0) });
    }
    else { // normal point
        _m.setIcon({ url: "../Content/img/pin/point.png", size: new google.maps.Size(10, 10), anchor: new google.maps.Point(5, 5) });
        _m.addListener("dragend", function (e) {
            onDragEnd({ id: id, latLng: e.latLng });
        });
    }

    var _id;
    _id = id.substring(id.lastIndexOf('_') + 1);

    point_views.push({ Id: _id, Lat: lat, Lng: lng, Pr: pr, CstId: cust });
    return _m;
}

function refreshAreaLine() {
    var line = [];
    $.each(point_views, function (i, item) {
        line.push(new google.maps.LatLng(item.Lat, item.Lng));
    });
    refreshMovingShape(line);
}

function refreshAreaLable() {

    $.each(point_views, function (i, item) {
        var _m = getMarkerById("point_" + item.Id);
        _m.set("labelContent", item.Pr);
    });
}

function addNewPoint(pr, lat, lng, cust) {
    new_id++;
    var guid = get_temp_guid(new_id);
    if (pr == -1) { pr = new_id; }

    addPoint(guid, pr, lat, lng, cust);
}

//---------------------------------------------------------------------------------------------------------
// MAP
//---------------------------------------------------------------------------------------------------------
function disableGrid() {
    $("#grid_area").prop('disabled', true);
    $("#grid_area").attr("disabled", "true");
    //$(".btn-grid").hide();
    $(".btn-grid").prop('disabled', true);
    $(".span-btn-grid").removeClass("color-gray");
    $(".span-btn-grid").addClass("color-light-gray");
}
function enableGrid() {
    $("#grid_area").prop('disabled', false);
    $("#grid_area").children().prop('disabled', false);
    //$(".btn-grid").show();
    $(".btn-grid").prop('disabled', false);
    $(".span-btn-grid").removeClass("color-light-gray");
    $(".span-btn-grid").addClass("color-gray");
}
//----------------------------
//declare customer on map
//----------------------------
function refreshMapForCustomer() {

    if (selected_id != null) {
        $("#btn_add_new_customer").hide();
        $("#mapContainer").show();
        $("#btn_customer_save").show();
        $("#btn_cancel").show();
        disableGrid();

        clearOverlays();
        point_views = [];
        customer_views = [];
        addListener('click', addCustomerByClick);

        var isleaf = selectedRowIsLeaf();

        drawAreaCustomerPoints(false, isleaf, true);
        drawAreaLinePoints(false, isleaf, true);
    }
}


function addCustomerpoint(guid, lat, lng, pointid) {

    var m = addMarker({
        id: "customer_point_" + guid,
        lat: lat, lng: lng,
        tit: '', draggable: true, label: '',
        clustering: false,
    });

    if (pointid != '') {
        var index = findPointMarkerIndex(pointid);
        point_views[index].CstId = guid;
        m.setIcon({ url: "../Content/img/pin/customer1.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
    }
    else {
        m.setIcon({ url: "../Content/img/pin/customernew.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) })
        m.addListener("dragend", function (e) {
            onCustomerDragEnd({ id: "customer_point_" + guid, latLng: e.latLng });
        });
    }

    customer_views.push({ Id: guid, Lat: lat, Lng: lng });

    closeCustomerDialog();
    return m;

}

function closeCustomerDialog() {
    $("#customer").val('');
    $("#dlg_customer_hdn_id").val('');
    $("#dlg_customer_hdn_point_id").val('');
    $("#dlg_customer_hdn_lat").val('');
    $("#dlg_customer_hdn_lng").val('');
    $("#dlg_customer").modal('hide');
}

function addCustomerByClick(args) {

    $("#dlg_customer_hdn_id").val('');
    $("#dlg_customer_hdn_point_id").val('');
    $("#dlg_customer_hdn_lat").val(args.latLng.lat());
    $("#dlg_customer_hdn_lng").val(args.latLng.lng());


    $("#dlg_customer").modal('show');
}

function onCustomerDragEnd(args) {

    var index = findCustomerViewIndex(args.id);
    if (index > -1) {
        customer_views[index].Lat = args.latLng.lat();
        customer_views[index].Lng = args.latLng.lng();
    }
    var _m = getMarkerById(args.id);
    _m.setIcon({ url: "../Content/img/pin/customernew.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
}

function findCustomerViewIndex(id) {
    var _id;
    _id = id.substring(id.lastIndexOf('_') + 1);

    for (var i = 0; i < customer_views.length; i++) {
        if (customer_views[i].Id == _id) {
            return i
        }
    }

    //if not found
    customer_views.push({ Id: _id, Lat: 0, Lng: 0 });
    return customer_views.length - 1;
}
//----------------------------
// Area
//----------------------------
function refreshMap(edit) {
    showWating();
    $("#btn_customer_save").hide();
    if (selected_id == null) {
        $("#mapContainer").hide();
        $("#btn_save").hide();
    }
    else {
        //location.hash = selected_id;
        $("#mapContainer").show();
        if (edit == true) {
            $("#btn_save").show();
            $("#btn_cancel").show();
            $("#btn_add_new_customer").hide();
            disableGrid();
        }
        else {
            $("#btn_save").hide();
            $("#btn_cancel").hide();
            $("#btn_add_new_customer").show();
            enableGrid();
        }

        var grid = $("#grid_area").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());
        var isleaf = selectedItem.IsLeaf;

        clearOverlays();
        point_views = [];
        customer_views = [];
        new_id = 0;
        if (edit) addListener('click', addPointByClick);
        else removeListener('click');

        drawAreaCustomerPoints(edit, isleaf);

        if (edit) {
            drawAreaSibilingLine();
        }
        else {
            if (!isleaf)
                drawAreaChildLine();
        }
        // drawAreaParentLine();
        drawAreaLinePoints(edit, isleaf);
    }
}

function drawAreaParentLine(fitparent) {
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
                    addPolyline({ line: arealine, color: '#001100', dashed: true, fit: fitparent });
                }
            }
            fitPointBounds();
        }
    });
}

function drawAreaSibilingLine() {
    $.ajax({
        type: "POST",
        url: url_loadareasibilingpoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777', lable: line.Lable });
                    }
                }); 
            }
        }
    });
}

function drawAreaChildLine() {
    $.ajax({
        type: "POST",
        url: url_loadareachildgpoints,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: selected_id }),
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777', lable: line.Lable });
                    }
                });
            }
        }
    });
}

function drawAreaCustomerPoints(edit, isleaf, editcustomer) {
    editcustomer = editcustomer || false;
    customerLoad = true;

    if (isleaf) {
        var showcustrout = editcustomer || $("#chk_customer_route").is(':checked');
        var showcustotherrout = editcustomer || $("#chk_customer_other_route").is(':checked');
        var showcustwithoutrout = editcustomer || $("#chk_customer_without_route").is(':checked');

        if (showcustrout || showcustotherrout || showcustwithoutrout) {
            customerLoad = false;
            $.ajax({
                type: "POST",
                url: url_loadarealeafcustomerpoints,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    Id: selected_id,
                    Showcustrout: showcustrout,
                    Showcustotherrout: showcustotherrout,
                    Showcustwithoutrout: showcustwithoutrout
                }),
                success: function(data) {
                    $.each(data, function(i, item) {
                        var _m = addMarker({
                            id: "customer_point_" + item.Id,
                            lat: item.Latitude,
                            lng: item.Longitude,
                            draggable: editcustomer,
                            clustering: true
                        });
                        _m.setIcon({ url: "../Content/img/pin/customer" + item.PointType + ".png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
                        _m.addListener('click', function(e) {
                            onCustomerMarkerClick(e, item.Id, _m, item.Desc, (!editcustomer && edit && isleaf))
                        });

                        if (editcustomer)
                            _m.addListener("dragend", function(e) {
                                onCustomerDragEnd({ id: "customer_point_" + item.Id, latLng: e.latLng });
                            });

                    });
                    renderClusterMarkers();
                }
            })
                .always(function() {
                    hideWating();
                    customerLoad = true;
                });
        }
    }
    else {
        if (editcustomer || $("#chk_customer").is(':checked')) {
            customerLoad = false;
            $.ajax({
                type: "POST",
                url: url_loadareacustomerpoints,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ Id: selected_id }),
                success: function (data) {
                    $.each(data, function (i, item) {
                        var _m = addMarker({
                            id: "customer_point_" + item.Id,
                            lat: item.Latitude, lng: item.Longitude,
                            draggable: editcustomer,
                            windowdesc: item.Desc, clustering: true
                        });
                        _m.setIcon({ url: "../Content/img/pin/customer" + item.PointType + ".png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) })
                        if (editcustomer)
                            _m.addListener("dragend", function (e) {
                                onCustomerDragEnd({ id: "customer_point_" + item.Id, latLng: e.latLng });
                            });
                    });
                    renderClusterMarkers();
                }
            })
            .always(function () {
                hideWating();
                customerLoad = true;
            });            
        }
    }
}

function drawAreaLinePoints(edit, isleaf, editcustomer) {
    editcustomer = editcustomer || false;
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
                        m = addPoint(item.Id, item.Lable, item.Latitude, item.Longitude, item.ReferId);
                        new_id = item.Lable;
                    }
                    arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                });

                if (isleaf) {
                    var l = addPolyline({
                        line: arealine, color: data.Color, weight: 3, windowdesc: data.Desc,
                        movingshape: true, direction: true, fit: true
                    });
                }
                else {
                    if (editcustomer) {
                        if (arealine.length > 0)
                            arealine.push(arealine[0]);
                        var l = addPolyline({
                            line: arealine,
                            color: data.Color,
                            weight: 3,
                            windowdesc: data.Desc,
                            fit: true
                        });

                    } else {
                        
                        var poly = addPolygon({ line: arealine, color: data.Color, weight: 3, windowdesc: data.Desc, movingshape: true, fit: true });
                        poly.addListener('click', function (event) {
                            showDetail(selected_id);
                        });

                    }
                }
                if (!editcustomer)
                    drawAreaParentLine(arealine.length == 0);

            }
        }
    }).always(function () {
        if (customerLoad)
            hideWating();
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
    if (id.lastIndexOf('_') > -1)
        _id = id.substring(id.lastIndexOf('_') + 1);
    else _id = id;

    for (var i = 0; i < point_views.length; i++) {
        if (point_views[i].Id == _id) {
            return i;
        }
    }
    return -1;
}

function findPointMarkerIndexByCustomer(id) {

    for (var i = 0; i < point_views.length; i++) {
        if (point_views[i].CstId == id) {
            return i;
        }
    }
    return -1;
}

//---------------------------------------------------------------------------
// window
//---------------------------------------------------------------------------
window.onhashchange = function () {
    if (location.hash.length > 0) {
        var _id = location.hash.replace('#', '');
        if (_id != selected_id) {
            selected_id = _id;
            refreshMap(false);
        }

    }
};
//window.onbeforeunload = function () { return "You work will be lost."; };


window.onkeydown = function (e) {
    ctr = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true));
};
window.onkeyup = function (e) {
    ctr = false;
};