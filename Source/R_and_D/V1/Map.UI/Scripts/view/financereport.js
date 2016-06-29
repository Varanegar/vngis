

$(document).ready(function () {

    $('input[type=radio][name=report_type]').change(function () {
        $("#grid_area").show();
        if (this.value == 1) {
            $("#div_custom_point").hide();
            setDropdownPrintBtn("FinanceReport");
        }
        else if (this.value == 2) {
            $("#div_custom_point").show();
            setDropdownPrintBtn("FinanceValueReport");
        }
    });

    setDropdownPrintBtn("FinanceReport");
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
        sendToPrintFinanceReport(reportname);
    } else {
        sendToPrintFinanceValueReport(reportname);
    }
}
function sendToPrintFinanceReport(reportname) {
    freezUI();

    $.ajax({
        type: "POST",
        url: urls.printfinancereport,
        //dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter(null)),
        success: function (data) {
            window.open('/FinanceReport/ShowPrintFinanceReport?reportFileName="' + reportname + '"', "_blank");
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
    $("#div_area_info").html('');
    $('#tab_area_list').trigger('click');

    if ($('input[name="report_type"]:checked').val() == 1) {
        if ((ids == undefined) || (ids == null))
            ids = getSelectedIds("grid_area");
        new_id = 0;
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
    accountManagerApp.callApi(urls.loadfinancereport, 'POST', getFinanceFilter(ids),
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
                                lablewindowdesc: getFinanceReportHtml(line.jData),
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
                                lablewindowdesc: getFinanceReportHtml(line.jData),
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
                            setAreaInfoPanel(getFinanceReportHtml(line.jData));
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
    accountManagerApp.callApi(urls.loadfinancereportcustomer, 'POST', 
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
                            openInfoWindow(new google.maps.LatLng(item.latitude, item.longitude), getFinanceReportHtml(item.jData));
                            setAreaInfoPanel(getFinanceReportHtml(item.jData));
                        });
                    
                    });
                    renderClusterMarkers();
                    fitPointBounds();
                    changed = false;
                }
        });

    }

//--------------------------------------------------------------------------------
//condition
//--------------------------------------------------------------------------------
function getFinanceFilter(ids) {
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

        OpenFactorCount: $("#chk_opent_factor_count").is(":checked"),
        OpenFactorAmount: $("#chk_opent_factor_amount").is(":checked"),
        OpenFactorDay: $("#chk_opent_factor_day").is(":checked"),
        RejectChequeCount: $("#chk_reject_cheque_count").is(":checked"),
        RejectChequeAmount: $("#chk_reject_cheque_amount").is(":checked"),
        InprocessChequeCount: $("#chk_inprocess_cheque_count").is(":checked"),
        InprocessChequeAmount: $("#chk_inprocess_cheque_amount").is(":checked"),
        FirstCredit: $("#chk_first_credit").is(":checked"),
        RemainedCredit: $("#chk_remained_credit").is(":checked"),
        FirstDebitCredit: $("#chk_first_debit_credit").is(":checked"),
        RemainedDebitCredit: $("#chk_remained_debit_credit").is(":checked")

    };
}


//--------------------------------------------------------------------------------
//window
//--------------------------------------------------------------------------------
function removeCacheData(clientid) {
    accountManagerApp.callApi(urls.removefinancereportcache, 'POST',
    {
        ClientId: clientid
    },

    function (data) {
    }, false);
}

window.onbeforeunload = function (event) {
    removeCacheData(client_id);
};
