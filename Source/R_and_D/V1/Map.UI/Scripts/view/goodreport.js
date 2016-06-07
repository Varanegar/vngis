var selected_id = null;
var map_auto_refresh = false;
var client_id;
var changed;

var point_views = [];
var new_id = 0;


$(document).ready(function () {
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

    $("#pnl_header_condition input:not(:radio)").on("change", function (e) {
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

    $('input[type=radio][name=report_type]').change(function () {
        $("#grid_area").show();

        if (this.value == 1) {
            $("#div_custom_point").hide();
        }
        else if (this.value == 2) {
            $("#div_custom_point").show();
        }
    });

    
    $("#chk_custom_point").on("change", function (e) {
        point_views = [];
        if (this.checked) {
            $("#grid_area").hide();
            clearOverlays();
            addListener('click', addReportPointByClick);
            addPolygon({
                line: [], color: '#990000', weight: 3,
                movingshape: true, fit: true
            });
        } else {
            $("#grid_area").show();
            removeListener('click');            
        }
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

/**********************************************************/
// Custom point
/**********************************************************/
function addReportPointByClick(args) {
    //addNewPoint(-1, , );
    
    new_id++;
    var id = get_temp_guid(new_id);
    closeInfoWindow();

   // addPoint(guid, pr, lat, lng);
    var m = addMarker({
        id: "point_" + id,
        lat: args.latLng.lat(),
        lng: args.latLng.lng(),
        draggable: true, label: new_id,
        clustering: false,
        map: gmap,
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
                "<button id='btn_remove_point_' onclick=removePoint('" + id + "') class='btn btn-default'>حذف</button>" ;

            openInfoWindow(new google.maps.LatLng(args.latLng.lat(), args.latLng.lng()), windowdesc);
        }
    });

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
/**********************************************************/
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
        function(result) {
            options.success(result);

            if (map_auto_refresh == true) {
                var ids = [];
                $.each(result, function(i, item) {
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

    if ($('input[name="report_type"]:checked').val() == 1) {
        if ((ids == undefined) || (ids == null))
            ids = getSelectedIds("grid_area");
        clearOverlays();
        $("#div_area_info").html('');
        $('#tab_area_list').trigger('click');
        drawAreaInfo(ids);
    } else {
        if ($("#chk_custom_point").is(":checked")) {
            drawAreaMarker(null);
        } else {
            if ((ids == undefined) || (ids == null))
                ids = getSelectedIds("grid_area");
            clearOverlays();
            drawAreaMarker(ids);
            drawAreasLine(ids);

        }
    }
}

function drawAreaInfo(ids) {
    accountManagerApp.callApi(urls.loadproductreport, 'POST', getFilter(ids),
         function (data) {
            if (data != null) {
                var leafid = [];
                $.each(data, function (i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        var poly;
                        if (line.isLeaf) {
                            poly = addPolyline({
                                line: arealine,
                                color: '#777777',
                                lable: line.lable,
                                lableclass: 'good-report-labels',
                                lablewindowdesc: getGoodReportHtml(line.jData),
                                //showbubble: true,
                                direction: true,
                                fit: true
                            });
                            leafid.push(line.masterId);
                        }
                        else {

                            poly = addPolygon({
                                line: arealine,
                                color: '#777777',
                                lable: line.lable,
                                lableclass:'good-report-labels',
                                lablewindowdesc: getGoodReportHtml(line.jData),
                                //showbubble: true,
                                fit: true
                            });

                            poly.addListener('click', function(event) {
                                selected_id = line.masterId;
                                map_auto_refresh = true;
                                refreshGrid();
                            });

                        }
                        poly.addListener('mouseover', function (e) {
                            setAreaInfoPanel(getGoodReportHtml(line.jData));
                        });
                    }
                });
                if (leafid.length > 0) {

                    drawAreaCustomer(leafid);
                } 
                fitPointBounds();
                changed = false;
            }
    });

}

function drawAreaCustomer(leafids) {
    accountManagerApp.callApi(urls.loadproductreportcustomer, 'POST', 
            { clientId: client_id, areaIds: leafids },
            function (data) {
                if (data != null) {
                    $.each(data, function(i, item) {
                        var m = addMarker({
                            id: "customer_point_" + item.uniqueId,
                            lat: item.latitude,
                            lng: item.longitude,
                            clustering: true,
                            fit: true
                        });
                        m.setIcon({ url: "../Content/img/pin/customerNew.png", size: MarkersIcon.Customer.Size, anchor: MarkersIcon.Customer.Anchor });

                        m.addListener('click', function (e) {
                            closeInfoWindow();                        
                            openInfoWindow(new google.maps.LatLng(item.latitude, item.longitude), getGoodReportHtml(item.jData));
                            setAreaInfoPanel(getGoodReportHtml(item.jData));
                        });
                    
                    });
                    renderClusterMarkers();
                    fitPointBounds();
                    changed = false;
                }
        });

    }

function setAreaInfoPanel(desc) {
    $("#div_info").html(desc);
    $('#tab_info').trigger('click');

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
        DefaultField:$('#ddl_default').val(),
        FromDate: $("#dte_from").val(),
        ToDate: $("#dte_to").val(),
        SaleOffice: $("#ddl_sale_office").val(),
        Header: $("#ddl_header").val(),
        Seller: $("#ddl_seller").val(),
        CustomerClass: $("#ddl_customer_class").val(),
        CustomerActivity: $("#ddl_customer_activity").val(),
        CustomerDegree: $("#ddl_customer_degree").val(),
        GoodGroup: parseInt( $("#ddl_good_group").val()),
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
