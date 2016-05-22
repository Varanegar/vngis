var point_views = [];
var customer_views = [];
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
        columns: [{ field: "areaName", title: 'عنوان' }

        , {
            field: "uniqueId",
            title: "&nbsp; &nbsp;",
            attributes: { style: "width:60px;" },
            template:
                "<button  type='button' class='btn-link btn-grid' onclick='editArea()';><span class='glyphicon glyphicon-pencil color-gray span-btn-grid'></span ></button>" +
                "<button  type='button' class='btn-link btn-grid' onclick='removeArea()';><span class='glyphicon glyphicon-trash color-gray span-btn-grid'></span ></button>" +
                "<button  value='#=isLeaf#' type='button' class='btn-link btn-grid btn-detail' onclick=showDetail('#=uniqueId#');><span class='glyphicon glyphicon-zoom-in color-gray span-btn-grid'></span ></button>"
        }
        , { field: "isLeaf", hidden: true, }
        ]
    });

    $('#customer').kendoAutoComplete({
        dataTextField: 'title',
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
                $("#dlg_customer_hdn_id").val(dataItem.uniqueId);

            }
            else
                $("#dlg_customer_hdn_id").val('');

            // Use the selected item or its text
        }
    });

    initMap('mapContainer', MapCenterPosition);



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
                    field: "uniqueId",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    filterable: false,
                    //attributes: { style: "width:15px;" },
                    template: "<button  type='button' class='btn-link btn-grid' onclick=addToSelectedBtn('#=uniqueId#'); ><span class='glyphicon glyphicon-chevron-down color-gray'></span ></button>"
                },
                { field: "customerCode", title: "کد", width: 100, },
                { field: "customerName", title: "نام مشتری" },
                { field: "phone", title: "تلفن", width: 100 },
                { field: "storeName", title: "فروشگاه", width: 100, },
                { field: "activity", title: "فعالیت", width: 100, },
                { field: "desc", title: "آدرس" },
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
                    field: "uniqueId",
                    title: "&nbsp; &nbsp;",
                    width: 40,
                    filterable: false,
                    template: "<button  type='button' class='btn-link btn-grid' onclick=removeFromSelectedBtn('#=uniqueId#'); ><span class='glyphicon glyphicon-chevron-up color-gray'></span ></button>"
                },
                { field: "customerCode", title: "کد", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "customerName", title: "نام مشتری", filterable: { cell: { operator: "contains" } } },
                { field: "phone", title: "تلفن", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "storeName", title: "فروشگاه", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "activity", title: "فعالیت", width: 100, filterable: { cell: { operator: "contains" } } },
                { field: "desc", title: "آدرس", filterable: { cell: { operator: "contains" } } }
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
    accountManagerApp.callApi(urls.savepoints, 'POST',
        { regionAreaId: selected_id, regionAreaPointDataList: point_views },
        function (data) {
            refreshMap(false);
        });
}

function saveCustomerPositions(savepoint) {
    savepoint = savepoint || false;
    if (customer_views.length > 0)
        accountManagerApp.callApi(urls.changecustomerposition, 'POST',
            {customerPointDataList : customer_views},
            function (data) {
                if (savepoint == true)
                    savePoints();
                else
                    refreshMap(false);
            }
        );
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
            accountManagerApp.callApi(urls.removepoints, 'POST',
                        { regionAreaId: selected_id },
                function(data) {
                    if (data == true) {
                        refreshMap(false);
                    } else {
                        alert('محدوده مورد نظر دارای زیر شاخه می باشد. امکان حذف وجود ندارد.');
                    }
                }
            );
        }
    }

};

function showDetail(id) {
    var selectedRowData = getSelectedRow("grid_area");

    if (selectedRowData.isLeaf == false)
        accountManagerApp.callApi(urls.haspoint, 'POST', { regionAreaId: id }, function (data) {
            if (data == true) {
                refreshGrid();
            }
            else {
                alert("لطفا محدوده را مشخص کنید!");
            }
        });

};

function loadAreaList(options) {
    accountManagerApp.callApi(urls.loadarealist, 'POST', { regionAreaParentId: selected_id },
        function (data) {
            gridchange_flag = true;
            options.success(data);
        });
}

function refreshGrid() {
    gridchange_flag = false;
    if (selected_id != null) {
        accountManagerApp.callApi(urls.getareapath, 'POST', { regionAreaId: selected_id },
            function (data) {
                var list = "<button id = 'btn_back_0' class='btn btn-link color-gray' onclick='back(0)' > خانه</button>";
                for (var i = data.length - 1 ; i >= 0 ; i--) {
                    list += ">> <button id = 'btn_back_'" + data[i].uniqueId + " class='btn btn-link color-gray' onclick=back('" + data[i].uniqueId + "') >" + data[i].title + "</button> ";
                }

                $("#pnl_path").html(list);
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
        if (selected_id != selectedData.uniqueId) {
            selected_id = selectedData.uniqueId;
            refreshMap(false);
            if (selected_id == null) {
                $("#btn_detail").hide();
                $("#btn_edit").hide();
            }
            else {
                $("#btn_edit").show();
                if (selectedData.isLeaf) {
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
    var selectedItem = getSelectedRow("grid_area");
    
    if ((selectedItem != undefined) && (selectedItem != null))
        return selectedItem.isLeaf;
    return false;
}

//---------------------------------------------------------------------------------------------------------
// Cutomer
//---------------------------------------------------------------------------------------------------------
//-----------------------------------------
// auto cpmplete
//-----------------------------------------
function loadCustomerAutoComplete(options) {
    accountManagerApp.callApi(urls.autocompleteustomer, 'POST',
        { searchTerm: $("#customer").val() },
        function (result) {
            options.success(result);
        }
    );
}


//-----------------------------------------
// grid
//-----------------------------------------
function loadNotSelectedCustomer(options) {
    accountManagerApp.callApi(urls.loadnotselectedcustomer, 'POST',
            { regionAreaId: selected_id },
            function (result) {
                options.success(result);
            }
        );
}

function loadSelectedCustomer(options) {
    accountManagerApp.callApi(urls.loadselectedcustomer, 'POST',
            { regionAreaId: selected_id },
            function (result) {
                options.success(result);
            }
        );
}

function addToSelectedBtn(id) {
    accountManagerApp.callApi(urls.addcustomertoarea,'POST',
        { customerId: id, regionAreaId: selected_id },
        function (data) {
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    );
}

function removeFromSelectedBtn(id) {
    accountManagerApp.callApi(urls.removecustomerfromarea,'POST',
        { customerId: id, regionAreaId: selected_id },
        function (data) {
            if (($('#grid_customer_not_selected').data('kendoGrid') != undefined) && ($('#grid_customer_not_selected').data('kendoGrid') != null)) {
                $('#grid_customer_not_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_not_selected').data('kendoGrid').refresh();
                $('#grid_customer_selected').data('kendoGrid').dataSource.read();
                $('#grid_customer_selected').data('kendoGrid').refresh();
            }
        }
    );
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
        if ((oicon.url.indexOf("customerselected") < 0) && (oicon.url.indexOf("customerotherrout") < 0)) {
            selected_markers.push({ marker: marker, oldicon: oicon });
            marker.setIcon({ url: "../Content/img/pin/customerselected.png", size: MarkersIcon.Customer.Size, anchor:  MarkersIcon.Customer.Anchor });

            if (selected_markers.length > 1) {
                closeInfoWindow();

                $("#btn_add_customer_list").show();
                $("#btn_remove_customer_list").show();
            }
            else {
                var windowdesc = '';
                if (oicon.url.indexOf("customerwithoutrout") > 0) {
                    windowdesc = "<br />" + desc + "<br />" +
                        "<button id='btn_add_customer_' onclick='addToSelected(\"" + id + "\", true)' class='btn btn-default'>افزودن به مسیر</button>";
                }
                else {
                    windowdesc = "<br />" + desc + "<br />" +
                        "<button id='btn_remove_customer_' onclick='removeFromSelected(\"" + id + "\", true)' class='btn btn-default'>حذف از مسیر</button>";
                }
                openInfoWindow(e.latLng, windowdesc);
            }
        }
    }
    else {
        openInfoWindow(e.LatLng, "<br />" + desc);
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
    var index = findCustomerMarkerIndex(id);
    if (index > -1) {
        var mrk = selected_markers[index].marker;
        mrk.setIcon({ url: "../Content/img/pin/customerotherrout.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });
        selected_markers.splice(index, 1);
        closeInfoWindow();
        addNewPoint(-1, mrk.getPosition().lat(), mrk.getPosition().lng(), id);
        refreshAreaLine();
    }
}

function removeFromSelected(id) {
    var index = findCustomerMarkerIndex(id);
    if (index > -1) {
        var mrk = selected_markers[index].marker;
        mrk.setIcon({ url: "../Content/img/pin/customerwithoutrout.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });
        selected_markers.splice(index, 1);

        var pointindex = findPointMarkerIndexByCustomer(id);
        if (pointindex > -1) {
            removeMarkerById("point_" + point_views[pointindex].UniqueId);
            for (var i = pointindex; i < point_views.length - 1; i++) {
                point_views[i].Pr = (parseInt(point_views[i].Pr) - 1).toString();
            }
            point_views.splice(pointindex, 1);
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
        gmap.getZoom();
        addNewPoint(parseInt(point.Pr) + 1, point.Lat - getSpace(), point.Lng - getSpace());
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

    var m = addMarker({
        id: "point_" + id,
        lat: lat, lng: lng, tit: pr, draggable: cust == '', label: pr,
        clustering: false,
    });
    m.addListener('click', function (event) {
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

            openInfoWindow(new google.maps.LatLng(lat, lng), windowdesc);

        }
    });



    if ((cust != undefined) && (cust != null) && (cust != '')) { // customer point
        m.setIcon({ url: MarkersIcon.PointMini.Url, size: MarkersIcon.PointMini.Size, anchor: MarkersIcon.PointMini.Anchor });
    }
    else { // normal point
        m.setIcon({ url: MarkersIcon.Point.Url, size: MarkersIcon.Point.Size, anchor: MarkersIcon.Point.Anchor });
        m.addListener("dragend", function (e) {
            onDragEnd({ id: id, latLng: e.latLng });
        });
    }

    var uid;
    uid = id.substring(id.lastIndexOf('_') + 1);

    point_views.push({ UniqueId: uid, Lat: lat, Lng: lng, Pr: pr, CstId: cust });
    return m;
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
        var m = getMarkerById("point_" + item.UniqueId);
        m.set("labelContent", item.Pr);
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
        m.setIcon({ url: "../Content/img/pin/customerotherrout.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });
    }
    else {
        m.setIcon({ url: "../Content/img/pin/customernew.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });
        m.addListener("dragend", function (e) {
            onCustomerDragEnd({ id: "customer_point_" + guid, latLng: e.latLng });
        });
    }

    customer_views.push({ UniqueId: guid, Lat: lat, Lng: lng });

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
    var m = getMarkerById(args.id);
    m.setIcon({ url: "../Content/img/pin/customernew.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });
}

function findCustomerViewIndex(id) {
    var gid;
    gid = id.substring(id.lastIndexOf('_') + 1);

    for (var i = 0; i < customer_views.length; i++) {
        if (customer_views[i].UniqueId == gid) {
            return i;
        }
    }

    //if not found
    customer_views.push({ UniqueId: gid, Lat: 0, Lng: 0 });
    return customer_views.length - 1;
}
//----------------------------
// Area
//----------------------------
function refreshMap(edit) {
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

        var isleaf = selectedRowIsLeaf();

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
    accountManagerApp.callApi(urls.loadareaparentpoints, 'POST',
        { regionAreaId: selected_id },
        function (data) {
            var arealine = [];
            if ((data != null) && (data.points != null)) {

                $.each(data.points, function (i, item) {
                    arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                });
                if (arealine.length > 0) {
                    addPolyline({ line: arealine, color: '#001100', dashed: true, fit: fitparent });
                }
            }
            fitPointBounds();
        }
    );
}

function drawAreaSibilingLine() {
    accountManagerApp.callApi(urls.loadareasibilingpoints, 'POST',
        { regionAreaId: selected_id },
        function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777', lable: line.lable });
                    }
                }); 
            }
        }
    );
}

function drawAreaChildLine() {
    accountManagerApp.callApi(urls.loadareachildgpoints, 'POST',
        { regionAreaId: selected_id },
        function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#777777', lable: line.lable });
                    }
                });
            }
        }
    );
}

function drawAreaCustomerPoints(edit, isleaf, editcustomer) {
    editcustomer = editcustomer || false;

    if (isleaf) {
        var showcustrout = editcustomer || $("#chk_customer_route").is(':checked');
        var showcustotherrout = editcustomer || $("#chk_customer_other_route").is(':checked');
        var showcustwithoutrout = editcustomer || $("#chk_customer_without_route").is(':checked');

        if (showcustrout || showcustotherrout || showcustwithoutrout) {
            accountManagerApp.callApi(urls.loadroutecustomerpoints, 'POST',
                {
                    regionAreaId: selected_id,
                    showCustRoute: showcustrout,
                    showCustOtherRoute: showcustotherrout,
                    showCustWithOutRoute: showcustwithoutrout
                },
                function(data) {
                    $.each(data, function(i, item) {
                        var m = addMarker({
                            id: "customer_point_" + item.id,
                            lat: item.latitude,
                            lng: item.longitude,
                            draggable: editcustomer,
                            clustering: true
                        });
                        var icon = "";
                        if (item.pointType.toLowerCase() == customerRout.toLowerCase()) icon = "rout";
                        if (item.pointType.toLowerCase() == customerOtherRout.toLowerCase()) icon = "otherrout";
                        if (item.pointType.toLowerCase() == customerWithoutRout.toLowerCase()) icon = "withoutrout";

                        m.setIcon({ url: "../Content/img/pin/customer" + icon + ".png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });

                        m.addListener('click', function (e) {
                            onCustomerMarkerClick(e, item.id, m, item.desc, (!editcustomer && edit && isleaf));
                        });

                        if (editcustomer)
                            m.addListener("dragend", function(e) {
                                onCustomerDragEnd({ id: "customer_point_" + item.id, latLng: e.latLng });
                            });

                    });
                    renderClusterMarkers();
                }
            );
        }
    }
    else {
        if (editcustomer || $("#chk_customer").is(':checked')) {
            accountManagerApp.callApi(urls.loadareacustomerpoints, 'POST',
                { regionAreaId: selected_id },
                function(data) {
                    $.each(data, function(i, item) {
                        var m = addMarker({
                            id: "customer_point_" + item.id,
                            lat: item.latitude,
                            lng: item.longitude,
                            draggable: editcustomer,
                            windowdesc: item.desc,
                            clustering: true
                        });

                        var icon = "";
                        if (item.pointType.toLowerCase() == customerRout.toLowerCase()) icon = "rout";
                        if (item.pointType.toLowerCase() == customerOtherRout.toLowerCase()) icon = "otherrout";
                        if (item.pointType.toLowerCase() == customerWithoutRout.toLowerCase()) icon = "withoutrout";
                        m.setIcon({ url: "../Content/img/pin/customer" + icon + ".png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });

                        if (editcustomer)
                            m.addListener("dragend", function(e) {
                                onCustomerDragEnd({ id: "customer_point_" + item.id, latLng: e.latLng });
                            });
                    });
                    renderClusterMarkers();
                }
            );
        }
    }
}

function drawAreaLinePoints(edit, isleaf, editcustomer) {
    editcustomer = editcustomer || false;
    accountManagerApp.callApi(urls.loadareapoints, 'POST',
        { regionAreaId: selected_id },
        function (data) {
            var arealine = [];
            if ((data != null) && (data.points != null)) {
                $.each(data.points, function (i, item) {
                    if (edit) {
                        addPoint(item.id, item.lable, item.latitude, item.longitude, item.referId);
                        new_id = item.lable;
                    }
                    arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                });

                if (isleaf) {
                    addPolyline({
                        line: arealine, color: data.color, weight: 3, windowdesc: data.cesc,
                        movingshape: true, direction: true, fit: true
                    });
                }
                else {
                    if (editcustomer) {
                        if (arealine.length > 0)
                            arealine.push(arealine[0]);
                        addPolyline({
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
    );

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
    var gid;
    if (id.lastIndexOf('_') > -1)
        gid = id.substring(id.lastIndexOf('_') + 1);
    else gid = id;

    for (var i = 0; i < point_views.length; i++) {
        if (point_views[i].UniqueId == gid) {
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
        var id = location.hash.replace('#', '');
        if (id != selected_id) {
            selected_id = id;
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