
$(document).ready(function () {
   
    $('input[type=radio][name=report_type]').change(function () {
        $("#grid_area").show();
        if (this.value == 1) {
            $("#div_custom_point").hide();
            setDropdownPrintBtn("ProductReport");
        }
        else if (this.value == 2) {
            $("#div_custom_point").show();
            setDropdownPrintBtn("ProductValueReport");
        }
    });

    setDropdownPrintBtn("ProductReport");
    loadDdlSaleOffice();
    loadDdlHeader();
    loadDdlSeller();
    loadDdlCustomer();
    loadDdlCustomerActivity();
    loadDdlCustomerDegree();
    loadDdlGoodGroup();
    loadDdlGood();
    loadDdlUnsoldGoodGroup();
    loadDdlUnsoldGood();

});

//--------------------------------------------------------------------------------
//print
//--------------------------------------------------------------------------------


function sendToPrint(reportname) {
    
    
    if ($('input[name="report_type"]:checked').val() == 1) {
        sendToPrintProductReport(reportname);
    } else {
        sendToPrintProductValueReport(reportname);
    }
}
function sendToPrintProductReport(reportname) {
    freezUI();

    $.ajax({
        type: "POST",
        url: urls.printproductreport,
        //dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter(null)),
        success: function (data) {
            window.location.href = '/GoodReport/ShowPrintProductReport?reportFileName="' + reportname + '"';
            unfreezUI();
        }
        
    }).fail(function (jqXHR) {
        showAjaxError(jqXHR);
        unfreezUI();
    });
    
}


//--------------------------------------------------------------------------------
//map
//--------------------------------------------------------------------------------

function refreshMap(ids) {
    clearOverlays();
    if ($('input[name="report_type"]:checked').val() == 1) {
        if ((ids == undefined) || (ids == null))
            ids = getSelectedIds("grid_area");
        new_id = 0;
        $("#div_area_info").html('');
        $('#tab_area_list').trigger('click');
        drawAreaInfo(ids);
    } else {
        if ($("#chk_custom_point").is(":checked")) {
            reDrawLine();
            drawAreaMarker(null);
            
        } else {
            if ((ids == undefined) || (ids == null))
                ids = getSelectedIds("grid_area");
            new_id = 0;
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
        
        UnSoldGoodGroup: parseInt($("#ddl_unsold_good_group").val()),
        UnSoldGood: $("#ddl_unsold_good").val(),

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

/*********************************************************************************************************************************************************/
/* removeCache*/
/*********************************************************************************************************************************************************/
function removeCacheData(clientid) {
    accountManagerApp.callApi(urls.removeproductreportcache, 'POST',
    {
        ClientId: clientid
    },

    function (data) {
    }, false);
}
//--------------------------------------------------------------------------------
//window
//--------------------------------------------------------------------------------
window.onbeforeunload = function (event) {
    removeCacheData(client_id);
};
