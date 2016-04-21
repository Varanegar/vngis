﻿var selected_id = null;
var map_auto_refresh = false;
var client_id;
var changed;


$(document).ready(function () {
    client_id = get_new_guid();
    changed = true;
    
    $("#div_advance_condition").hide();
    kendo.culture("fa-IR");

    intDate('dte_to', true);
    intDate('dte_from', true);
    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });

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
        height: 520,
        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: true,
        dataBound: dataBound,
        columns: [
            {
                field: "Id",
                headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_area\")' />",
                template: "<input type='checkbox' value='#=Id#' onchange='updateMasterCheckbox(\"grid_area\")' id=" + "chk" + "#=Id#" + " class='checkboxGrid'/>",
                width: 20
            },
            { field: "Id", title: '', hidden: true },
            { field: "IsLeaf", hidden: true, },
            { field: "Title", title: 'عنوان' },
            {
                field: "Id",
                title: "&nbsp; &nbsp;",
                width: 40,
                template:
                    "<button  value='#=IsLeaf#' type='button' class='btn-link btn-grid btn-detail' onclick=showDetail();><span class='glyphicon glyphicon-zoom-in color-gray span-btn-grid'></span ></button>"
            }
        ]
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

    $("#btn_run").on("click", function (e) {
        refreshMap();
    });

    $("#grid_area").on("dblclick", "tr.k-state-selected", function (e) {
        showDetail();
    });

    $("#pnl_header_condition input").on("change", function (e) {
        changed = true;
    });

    $("#pnl_header_condition select").on("change", function (e) {
        changed = true;
    });
    

    loadDdlSaleOffice();
    loadDdlHeader();
    loadDdlSeller();
    loadDdlCustomer();
    loadDdlCustomerActivity();
    loadDdlCustomerDegree();
    loadDdlGoodGroup();
    //loadDdlDunamicGroup();
    loadDdlGood();
});


function showDetail() {
    var row = getSelectedRow("grid_area");
    if (row.IsLeaf != true) {
        selected_id = row.Id;
        refreshGrid();
    }
}

function back(id) {
    selected_id = id;
    map_auto_refresh = true;
    refreshGrid();
}

//--------------------------------------------------------------------------------
//grid
//--------------------------------------------------------------------------------
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
                // location.hash = selected_id;
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

function loadAreaList(options) {
    $.ajax({
        type: "POST",
        url: url_loadarealist,
        data: JSON.stringify({ Id: selected_id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            options.success(result);

            if (map_auto_refresh == true) {

                var ids = [];
                $.each(result, function (i, item) {
                    ids.push(item.Id);
                });
                refreshMap(ids);
            }

        }
    });
}

//--------------------------------------------------------------------------------
//map
//--------------------------------------------------------------------------------
function refreshMap(ids) {
    showWating();
    clearOverlays();
    drawAreaInfo(ids);
}

function drawAreaInfo(ids) {
    $.ajax({
        type: "POST",
        url: url_loadgoodreport,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter(ids)),
       
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        if (line.IsLeaf)
                            poly = addPolyline({
                                line: arealine,
                                color: '#777777',
                                lable: line.Lable,
                                windowdesc: line.Desc,
                                showbubble: true,
                                direction: true,
                                fit: true
                            });
                        else {

                            poly = addPolygon({
                                line: arealine,
                                color: '#777777',
                                lable: line.Lable,
                                windowdesc: line.Desc,
                                showbubble: true,
                                fit: true
                            });

                            poly.addListener('click', function(event) {
                                selected_id = line.MasterId;
                                map_auto_refresh = true;
                                refreshGrid();
                            });

                        }
                    }
                });
                fitPointBounds();
                changed = false;
            }
        }
    })
    .always(function() {
        hideWating();
        map_auto_refresh = false;
    });

}

//--------------------------------------------------------------------------------
//condition
//--------------------------------------------------------------------------------
function getFilter(ids) {
    if ((ids == undefined) || (ids == null))
        ids = getSelectedIds("grid_area");

    return {
        AreaIds: ids,
        ClientId: client_id,
        ChangeFilter: changed,
        FromDate: $("#dte_from").val(),
        ToDate: $("#dte_to").val(),
        SaleOffice: $("#ddl_sale_office").val(),
        Header: $("#ddl_header").val(),
        Seller: $("#ddl_seller").val(),
        CustomerClass: $("#ddl_customer_class").val(),
        CustomerActivity: $("#ddl_customer_activity").val(),
        CustomerDegree: $("#ddl_customer_degree").val(),
        GoodGroup: $("#ddl_good_group").val(),
      //  DynamicGroup: $("#ddl_dynamic_group").val(),
        Good: $("#ddl_good").val(),
       // CommercialName: $("#txt_commercial_good_name").val(),
       // DayCount: $("#txt_day_not_visit").val(),

        RequestCount: $("#chk_request_count").is(":checked"),
        FactorCount: $("#chk_factor_count").is(":checked"),
        RejectCount: $("#chk_reject_count").is(":checked"),
        SaleItemCount: $("#chk_sale_item_count").is(":checked"),
        RejectItemCount: $("#chk_reject_item_count").is(":checked"),
        SaleQty: $("#chk_sale_qty").is(":checked"),
        RejectQty: $("#chk_reject_qty").is(":checked"),
        SaleAmount: $("#chk_sale_amount").is(":checked"),
        RejectAmount: $("#chk_reject_amount").is(":checked"),
        SaleCarton: false,
        RejectCarton : false,
        SaleWeight: $("#chk_sale_weight").is(":checked"),
        RejectWeight: $("#chk_reject_weight").is(":checked"),
        SaleDiscount: $("#chk_sale_discount").is(":checked"),
        RejectDiscount: $("#chk_reject_discount").is(":checked"),
        BonusCount: $("#chk_bonus_count").is(":checked"),
        BonusQty: $("#chk_bonus_qty").is(":checked")
    };
}


//--------------------------------------------------------------------------------
//window
//--------------------------------------------------------------------------------

window.onbeforeunload = function (event) {
    removeCacheData(client_id);
};

//window.onhashchange = function () {
//    var _id = '';
//    if (location.hash.length > 0) {
//        _id = location.hash.replace('#', '');
//    }
//    if (_id != selected_id) {
//        selected_id = _id;
//        refreshMap();
//    }
//};