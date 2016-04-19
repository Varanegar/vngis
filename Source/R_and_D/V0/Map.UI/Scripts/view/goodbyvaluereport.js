var selected_id = null;
var map_auto_refresh = false;

$(document).ready(function () {
    $("#div_advance_condition").hide();
    $("#pnl_marker .panel-value").hide();

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

        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,
        dataBound: dataBound,
        columns: [
            {
                field: "Id",
                headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_area\")' />",
                template: "<input type='checkbox' value='#=Id#' onchange='updateMasterCheckbox(\"grid_area\")' id=" + "chk" + "#=Id#" + " class='checkboxGrid'/>",
                attributes: { style: "width:10px;" }
            },
        { field: "Id", title: '', hidden: true },
        { field: "IsLeaf", hidden: true, },
        { field: "Title", title: 'عنوان' }
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
        var row = getSelectedRow("grid_area");
        if (row.IsLeaf != true) {
            selected_id = row.Id;
            refreshGrid();
        }
    });

    $("#pnl_marker input[type='checkbox']").on("change", function (e) {
        var flag = this.checked;
        var id = this.id.replace("chk","div");
        if (flag)
            $("#" + id).show();
        else {
            var fromid = this.id.replace("chk", "from");
            var toid = this.id.replace("chk", "to");

            $("#" + fromid).val('');
            $("#" + toid).val('');
            $("#" + id).hide();
        }

    });

});

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
    clearOverlays();
    if ((ids == undefined) || (ids == null))
        ids = getSelectedIds("grid_area");
    drawAreasLine(ids);
    drawAreaMarker(ids);
}

function drawAreasLine(ids) {
    $.ajax({
        type: "POST",
        url: url_loadareasline,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ids),
        success: function (data) {
            if (data != null) {
                $.each(data, function (i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function (j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        poly = addPolygon({ line: arealine, color: '#777777', lable: line.Lable });

                        poly.addListener('click', function (event) {
                            selected_id = line.MasterId;
                            map_auto_refresh = true;
                            refreshGrid();
                        });

                    }
                })
            }
        }
    });
}

function drawAreaMarker(ids) {
    $.ajax({
        type: "POST",
        url: url_loadgoodbyvaluereport,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter(ids)),
        always: function () { map_auto_refresh = false; },
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, item) {
                    var _m = addMarker({
                        id: "customer_point_" + item.Id,
                        lat: item.Latitude,
                        lng: item.Longitude,
                        clustering: true,
                        fit: true
                    });
                    _m.setIcon({ url: "../Content/img/pin/customerNew.png", size: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) });
                    _m.addListener('click', function(e) {
                        closeInfoWindow();
                        openInfoWindow(e, item.Desc);
                    });
                });
                renderClusterMarkers();
                fitPointBounds();
            }
        }
    });

}

//--------------------------------------------------------------------------------
//condition
//--------------------------------------------------------------------------------
function getFilter(ids) {
    return {
        AreaIds: ids,
        FromDate: $("#dte_from").val(),
        ToDate: $("#dte_to").val(),
        SaleOffice: $("#ddl_sale_office").val(),
        Header: $("#ddl_header").val(),
        Seller: $("#ddl_seller").val(),
        CustomerClass: $("#ddl_customer_class").val(),
        CustomerActivity: $("#ddl_customer_activity").val(),
        CustomerDegree: $("#ddl_customer_degree").val(),
        GoodGroup: $("#ddl_good_group").val(),
        DynamicGroup: $("#ddl_dynamic_group").val(),
        Good: $("#ddl_good").val(),
        CommercialName: $("#txt_commercial_good_name").val(),
        DayCount: $("#txt_day_not_visit").val(),

        RequestCountFrom: $("#from_request_count").val(),
        RequestCountTo: $("#to_request_count").val(),

        FactorCountFrom: $("#from_factor_count").val(),
        FactorCountTo: $("#to_factor_count").val(),

        RejectCountFrom: $("#from_reject_count").val(),
        RejectCountTo: $("#to_reject_count").val(),

        SaleItemCountFrom: $("#from_sale_item_count").val(),
        SaleItemCountTo: $("#to_sale_item_count").val(),

        RejectItemCountFrom: $("#from_reject_item_count").val(),
        RejectItemCountTo: $("#to_reject_item_count").val(),

        SaleAmountFrom: $("#from_sale_amount").val(),
        SaleAmountTo: $("#to_sale_amount").val(),

        RejectAmountFrom: $("#from_reject_amount").val(),
        RejectAmountTo: $("#to_reject_amount").val(),

        SalePriceFrom: $("#from_sale_price").val(),
        SalePriceTo: $("#to_sale_price").val(),

        RejectPriceFrom: $("#from_reject_price").val(),
        RejectPriceTo: $("#to_reject_price").val(),

        SaleWeightFrom: $("#from_sale_weight").val(),
        SaleWeightTo: $("#to_sale_weight").val(),

        RejectWeightFrom: $("#from_reject_weight").val(),
        RejectWeightTo: $("#to_reject_weight").val(),

        SaleDiscountFrom: $("#from_sale_discount").val(),
        SaleDiscountTo: $("#to_sale_discount").val(),

        RejectDiscountFrom: $("#from_reject_discount").val(),
        RejectDiscountTo: $("#to_reject_discount").val(),

        BonusCountFrom: $("#from_bonus_count").val(),
        BonusCountTo: $("#to_bonus_count").val(),

        BonusAmountFrom: $("#from_bonus_amount").val(),
        BonusAmountTo: $("#to_bonus_amount").val()
    }

}

