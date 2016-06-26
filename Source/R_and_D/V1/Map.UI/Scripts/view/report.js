var selected_id = null;
var map_auto_refresh = false;
var client_id;
var changed;
var point_views = [];
var new_id = 0;


$(document).ready(function() {
    client_id = get_new_guid();
    changed = true;


    $("#div_advance_condition").hide();
    $("#pnl_marker .panel-value").hide();
    $("#div_custom_point").hide();

    initMap('mapContainer', MapCenterPosition);


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
        height: 450,
        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: true,
        dataBound: dataBound,
        columns: [
            {
                field: "uniqueId",
                headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_area\")' />",
                template: "<input type='checkbox' value='#=uniqueId#' onchange='updateMasterCheckbox(\"grid_area\")' id=" + "chk" + "#=uniqueId#" + " class='checkboxGrid'/>",
                width: 25
            },
            { field: "uniqueId", title: '', hidden: true },
            { field: "isLeaf", hidden: true, },
            { field: "areaName", title: 'عنوان' },
            {
                field: "uniqueId",
                title: "&nbsp; &nbsp;",
                width: 40,
                template:
                    "<button  value='#=isLeaf#' type='button' class='btn-link btn-grid btn-detail' onclick=showDetail();><span class='glyphicon glyphicon-zoom-in color-gray span-btn-grid'></span ></button>"
            }
        ]
    });



    $("#btn_select_all").on("click", function (e) {
        $('#pnl_marker input:checkbox').prop('checked', true);
    });

    $("#btn_remove_all").on("click", function (e) {
        $('#pnl_marker input:checkbox').prop('checked', false);
    });
    $("#btn_clean").on("click", function (e) {
        cleanMap();
    });
    $("#btn_run").on("click", function (e) {
        refreshMap();
    });
    $("#btn_print").on("click", function (e) {
        sendToPrint();
    });

    
    $("#grid_area").on("dblclick", "tr.k-state-selected", function (e) {
        showDetail();
    });

    $("#pnl_header_condition input:not(:radio)").on("change", function (e) {
        changed = true;
    });

    $("#btn_clean").on("click", function (e) {
        cleanMap();
    });

    $("#pnl_marker input[type='checkbox']").on("change", function (e) {
        if ($('input[name="report_type"]:checked').val() == 2) {
            var flag = this.checked;
            var id = this.id.replace("chk", "div");
            if (flag)
                $("#" + id).show();
            else {
                var fromid = this.id.replace("chk", "from");
                var toid = this.id.replace("chk", "to");

                $("#" + fromid).val('');
                $("#" + toid).val('');
                $("#" + id).hide();
            }

        }

    });


    $("#chk_custom_point").on("change", function (e) {
        point_views = [];
        if (this.checked) {
            $("#grid_area").hide();
            cleanMap();
            addListener('click', addReportPointByClick);
        } else {
            $("#grid_area").show();
            removeListener('click');
        }
    });

    $("#btn_adv_con").on("click", function (e) {
        if ($("#div_advance_condition").is(':hidden')) {
            $("#div_advance_condition").show(500);
            $("#btn_adv_con").html('خلاصه');
        } else {
            $("#div_advance_condition").hide(500);
            $("#btn_adv_con").html('پیشرفته');
        }
    });


});


function setDropdownPrintBtn(report) {
    $("#dropdown_print").empty();
    accountManagerApp.callApi(urls.loadprintlist, 'POST',
        { reportName: report },
        function (data) {
            $.each(data, function (i, item) {
                $("#dropdown_print").append("<li><a href='#' onclick=sendToPrint('" + item.reportFileName + "');>" + item.reportTitle + "</a></li>");
            });
        });
}

/*********************************************************************************************************************************************************/
// Area List Grid
/*********************************************************************************************************************************************************/
function dataBound() {
    $('#mastercheckbox').prop("checked", true).change();

    var details = $('#grid_area .btn-detail');
    for (var i = 0; i < details.length; i++) {
        if (details[i].value.toLowerCase() == "true")
            details[i].hidden = true;
    }

}

function refreshGrid() {
    if ((selected_id != null) && (selected_id != undefined)) {
        accountManagerApp.callApi(urls.getareapath, 'POST', { regionAreaId: selected_id },
        function (data) {
            var list = "<button id = 'btn_back_0' class='btn btn-link color-gray' onclick='back(0)' > خانه</button>";
            for (var i = data.length - 1 ; i >= 0 ; i--) {
                list += ">> <button id = 'btn_back_'" + data[i].uniqueId + " class='btn btn-link color-gray' onclick=back('" + data[i].uniqueId + "') >" + data[i].title + "</button> ";
            }
            // location.hash = selected_id;
            $("#pnl_path").html(list);
        });
    }
    else {
        $("#pnl_path").html("");
    }
    $('#grid_area').data('kendoGrid').dataSource.read();
    $('#grid_area').data('kendoGrid').refresh();
}

function loadAreaList(options) {
    accountManagerApp.callApi(urls.loadarealist, 'POST', { regionAreaParentId: selected_id },
        function (result) {
            options.success(result);

            if (map_auto_refresh == true) {
                var ids = [];
                $.each(result, function (i, item) {
                    ids.push(item.uniqueId);
                });
                refreshMap(ids);
            }

        });
}

function showDetail() {
    var row = getSelectedRow("grid_area");
    if (row.IsLeaf != true) {
        selected_id = row.uniqueId;
        refreshGrid();
    }
}

function back(id) {
    selected_id = id;
    map_auto_refresh = true;
    refreshGrid();
}

/*********************************************************************************************************************************************************/
// Map
/*********************************************************************************************************************************************************/
function reDrawLine() {
    $.each(point_views, function (i, item) {
        addPoint("point_" + item.UniqueId, item.Lat, item.Lng, item.Pr);
    });
    addPolygon({
        line: [], color: '#990000', weight: 3,
        movingshape: true, fit: true
    });

    refreshAreaLine();
}

function setAreaInfoPanel(desc) {
    $("#div_info").html(desc);
    $('#tab_info').trigger('click');
}
/*********************************************************************************************************************************************************/
// Custom point
/*********************************************************************************************************************************************************/
function cleanMap() {
    point_views = [];
    new_id = 0;
    clearOverlays();
    addPolygon({
        line: [], color: '#990000', weight: 3,
        movingshape: true, fit: true
    });
}

function addPoint(id, lat, lng, pr) {

    // addPoint(guid, pr, lat, lng);
    var m = addMarker({
        id: "point_" + id,
        lat: lat,
        lng: lng,
        draggable: true, label: pr,
        clustering: false
    });
    m.setIcon({ url: MarkersIcon.Point.Url, size: MarkersIcon.Point.Size, anchor: MarkersIcon.Point.Anchor });

    m.addListener("dragend", function (e) {
        var index = findPointMarkerIndex(id);
        if (index > -1) {
            point_views[index].Lat = e.latLng.lat();
            point_views[index].Lng = e.latLng.lng();
        }
        refreshAreaLine();
    });

    m.addListener('click', function (event) {
        var index = findPointMarkerIndex(id);
        if (index > -1) {
            var windowdesc = "<br/>" +
                "<input type='number' id='txt_priority_" + id + "' value=" + id + " class='form-control' />" +
                "<br />" +
                "<button id='btn_remove_point_' onclick=removePoint('" + id + "') class='btn btn-default'>حذف</button>";

            openInfoWindow(new google.maps.LatLng(lat, lng), windowdesc);
        }
    });
}

function addReportPointByClick(args) {
    //addNewPoint(-1, , );

    new_id++;
    var id = get_temp_guid(new_id);
    closeInfoWindow();

    addPoint(id, args.latLng.lat(), args.latLng.lng(), new_id);

    point_views.push({ UniqueId: id, Lat: args.latLng.lat(), Lng: args.latLng.lng(), Pr: new_id });
    refreshAreaLine();
}

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

function refreshAreaLable() {

    $.each(point_views, function (i, item) {
        var m = getMarkerById("point_" + item.UniqueId);
        m.set("labelContent", item.Pr);
    });
}

function refreshAreaLine() {
    var line = [];
    $.each(point_views, function (i, item) {
        line.push(new google.maps.LatLng(item.Lat, item.Lng));
    });
    refreshMovingShape(line);
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


/*********************************************************************************************************************************************************/
/* Combo box*/
/*********************************************************************************************************************************************************/
function loadDdlSaleOffice() {
    $("#ddl_sale_office").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadSaleOffice }
        }
    });
}

function loadSaleOffice(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST',
         { TblName: "gnr.tblSaleOffice", ValueName: "ID", TextName: "Name" },
        function (result) {
            options.success(result);
        });
     }

function loadDdlHeader() {
    $("#ddl_header").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadHeader }
        }
    });
}

function loadHeader(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.vwSupervisor", ValueName: "ID", TextName: "FullName", AddEmptyRow: true },
        function (result) {
            options.success(result);
    });

}

function loadDdlSeller() {
    $('#ddl_seller').kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadSeller }
        }
    });
    
}

function loadSeller(options) {
    accountManagerApp.callApi(urls.getautocompletedata, 'POST',
            {
                tblName: "gnr.vwDealer",
//                searchTerm: $("#ddl_seller").val(),
                valueName: "ID",
                textName: "FullName"
            },
        function (result) {
            options.success(result);
        });

}

function loadDdlCustomer() {
    $("#ddl_customer_class").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomer }
        }
    });
}

function loadCustomer(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST',
        { TblName: "sle.tblCustCtgrSle", ValueName: "ID", TextName: "CustCtgrName", AddEmptyRow: true },
        function(result) {
            options.success(result);
        });
}

/******************************************************/
/* CustomerActivity                                   */
/******************************************************/
function loadDdlCustomerActivity() {
    $("#ddl_customer_activity").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomerActivity }
        }
    });
}
function loadCustomerActivity(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustAct", ValueName: "ID", TextName: "CustActName"},
        function(result) {
            options.success(result);
        });
}


/******************************************************/
/* CustomerDegree                                     */
/******************************************************/
function loadDdlCustomerDegree() {
    $("#ddl_customer_degree").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomerDegree }
        }
    });
}

function loadCustomerDegree(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustlevel", ValueName: "ID", TextName: "Title ", AddEmptyRow: true },
        function(result) {
            options.success(result);
        });
}

/******************************************************/
/* Good Group                                         */
/******************************************************/
function loadDdlGoodGroup() {
    $("#ddl_good_group").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGoodGroup }
        }
    });
}
function loadDdlUnsoldGoodGroup() {
    $("#ddl_unsold_good_group").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGoodGroup }
        }
    });
}

function loadGoodGroup(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblGoodsGroup", ValueName: "Id", TextName: "GoodsGroupName ", AddEmptyRow: true },
    function (result) {
        options.success(result);
    });

}

/******************************************************/
/* Good                                               */
/******************************************************/
function loadDdlUnsoldGood() {
    $("#ddl_unsold_good").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGood }
        }
    });
}

function loadDdlGood() {
    $("#ddl_good").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGood }
        }
    });
}

function loadGood(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblGoods", ValueName: "ID", TextName: "GoodsName ", AddEmptyRow: true },
    function (result) {
        options.success(result);
    });
}


function onComboChange(e) {
    changed = true;
}


