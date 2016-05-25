var selected_id = null;
var map_auto_refresh = false;
var client_id;
var changed;
var line_load = true;
var marker_load = true;

$(document).ready(function () {
    client_id = get_new_guid();
    changed = true;
    $("#div_advance_condition").hide();
    $("#pnl_marker .panel-value").hide();
    kendo.culture("fa-IR");
    
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
        height:440,
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

    $("#pnl_header_condition input").on("change", function (e) {
        changed = true;
    });

    $("#pnl_header_condition select").on("change", function (e) {
        changed = true;
    });

    $("#btn_select_all").on("click", function (e) {
        $('#pnl_marker input:checkbox').prop('checked', true);
    });

    $("#btn_remove_all").on("click", function (e) {
        $('#pnl_marker input:checkbox').prop('checked', false);
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

function back(id) {
    selected_id = id;
    map_auto_refresh = true;
    refreshGrid();
}

function showDetail() {
    var row = getSelectedRow("grid_area");
    if (row.IsLeaf != true) {
        selected_id = row.uniqueId;
        refreshGrid();
    }
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
    line_load = false;
    accountManagerApp.callApi(urls.loadareasline, 'POST',
    { regionAreaIds: ids },
    function(data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        var poly;
                        if (line.isLeaf == true)
                            poly = addPolyline({ line: arealine, color: '#000000', lable: line.lable, fit: true });
                        else {
                            poly = addPolygon({ line: arealine, color: '#000000', lable: line.lable, fit: true });

                            poly.addListener('click', function(event) {
                                selected_id = line.masterId;
                                map_auto_refresh = true;
                                refreshGrid();
                            });

                        }

                    }
                });
            }
    });
}

function drawAreaMarker(ids) {
    accountManagerApp.callApi(urls.loadproductvaluereport, 'POST',
        getFilter(ids),
        function(data) {
            if (data != null) {
                $.each(data, function(i, item) {
                    var m = addMarker({
                        id: "customer_point_" + item.id,
                        lat: item.latitude,
                        lng: item.longitude,
                        clustering: true,
                        fit: true
                    });
                    m.setIcon({ url: "../Content/img/pin/customerNew.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });

                    m.addListener('click', function(e) {
                        closeInfoWindow();
                        openInfoWindow(e.latLng, getGoodReportHtml(item.jData));
                        setCustomerInfoPanel(getGoodReportHtml(item.jData));
                    });

                });
                renderClusterMarkers();
                fitPointBounds();
                changed = false;
            }
        }
    );
}

function setCustomerInfoPanel(desc) {
    $("#div_customer_info").html(desc);
    $('#tab_customer_info').trigger('click');

}

    //--------------------------------------------------------------------------------
    //condition
    //--------------------------------------------------------------------------------
    function getFilter(ids) {
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
            //        DynamicGroup: $("#ddl_dynamic_group").val(),
            Good: $("#ddl_good").val(),
            //        CommercialName: $("#txt_commercial_good_name").val(),
            //        DayCount: $("#txt_day_not_visit").val(),

            FromRequestCount: $("#from_request_count").val(),
            ToRequestCount: $("#to_request_count").val(),

            FromFactorCount: $("#from_factor_count").val(),
            ToFactorCount: $("#to_factor_count").val(),

            FromRejectCount: $("#from_reject_count").val(),
            ToRejectCount: $("#to_reject_count").val(),

            FromSaleItemCount: $("#from_sale_item_count").val(),
            ToSaleItemCount: $("#to_sale_item_count").val(),

            FromRejectItemCount: $("#from_reject_item_count").val(),
            ToRejectItemCount: $("#to_reject_item_count").val(),

            FromSaleAmount: $("#from_sale_amount").val(),
            ToSaleAmount: $("#to_sale_amount").val(),

            FromRejectAmount: $("#from_reject_amount").val(),
            ToRejectAmount: $("#to_reject_amount").val(),

            FromSaleQty: $("#from_sale_qty").val(),
            ToSaleQty: $("#to_sale_qty").val(),

            FromRejectQty: $("#from_reject_qty").val(),
            ToRejectQty: $("#to_reject_qty").val(),

            FromSaleWeight: $("#from_sale_weight").val(),
            ToSaleWeight: $("#to_sale_weight").val(),

            FromRejectWeight: $("#from_reject_weight").val(),
            ToRejectWeight: $("#to_reject_weight").val(),

            FromSaleDiscount: $("#from_sale_discount").val(),
            ToSaleDiscount: $("#to_sale_discount").val(),

            FromRejectDiscount: $("#from_reject_discount").val(),
            ToRejectDiscount: $("#to_reject_discount").val(),

            FromBonusCount: $("#from_bonus_count").val(),
            ToBonusCount: $("#to_bonus_count").val(),

            FromBonusQty: $("#from_bonus_qty").val(),
            ToBonusQty: $("#to_bonus_qty").val()
        };

    }


    //--------------------------------------------------------------------------------
    //window
    //--------------------------------------------------------------------------------
    window.onbeforeunload = function (event) {
        removeCacheData(client_id);
    };
