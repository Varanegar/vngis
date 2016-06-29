function sendToPrintFinanceValueReport(reportname) {
    $.ajax({
        type: "POST",
        url: urls.printfinancevaluereport,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter(null)),
        success: function (data) {
            window.open('/FinanceReport/ShowPrintFinanceValueReport?reportFileName="' + reportname + '"', "_blank");
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

function drawAreasLine(ids) {
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
    accountManagerApp.callApi(urls.loadfinancevaluereport, 'POST',
        geFinanceValueFilter(ids),
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
                        openInfoWindow(e.latLng, getFinanceReportHtml(item.jData));
                        setCustomerInfoPanel(getFinanceReportHtml(item.jData));
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
    $("#div_info").html(desc);
    $('#tab_info').trigger('click');

}

    //--------------------------------------------------------------------------------
    //condition
    //--------------------------------------------------------------------------------
    function geFinanceValueFilter(ids) {
        return {
            AreaIds: ids,
            CustomPoint : point_views,
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

            UnSoldGoodGroup: parseInt($("#ddl_unsold_good_group").val()),
            UnSoldGood: $("#ddl_unsold_good").val(),
      
            FromOpenFactorCount: $("#from_opent_factor_count").val(),
            ToOpenFactorCount: $("#to_opent_factor_count").val(),
            FromOpenFactorAmount: $("#from_opent_factor_amount").val(),
            ToOpenFactorAmount: $("#to_opent_factor_amount").val(),
            FromOpenFactorDay: $("#from_opent_factor_day").val(),
            ToOpenFactorDay: $("#to_opent_factor_day").val(),
            FromRejectChequeCount: $("#from_reject_cheque_count").val(),
            ToRejectChequeCount: $("#to_reject_cheque_count").val(),
            FromRejectChequeAmount: $("#from_reject_cheque_amount").val(),
            ToRejectChequeAmount: $("#to_reject_cheque_amount").val(),
            FromInprocessChequeCoun: $("#from_inprocess_cheque_count").val(),
            ToInprocessChequeCoun: $("#to_inprocess_cheque_count").val(),
            FromInprocessChequeAmount: $("#from_inprocess_cheque_amount").val(),
            ToInprocessChequeAmount: $("#to_inprocess_cheque_amount").val(),
            FromFirstCredit: $("#from_first_credit").val(),
            ToFirstCredit: $("#to_first_credit").val(),
            FromRemainedCredit: $("#from_remained_credit").val(),
            ToRemainedCredit: $("#to_remained_credit").val(),
            FromFirstDebitCredit: $("#from_first_debit_credit").val(),
            ToFirstDebitCredit: $("#to_first_debit_credit").val(),
            FromRemainedDebitCredit: $("#from_remained_debit_credit").val(),
            ToRemainedDebitCredit: $("#to_remained_debit_credit").val(),
            
        };

    }
