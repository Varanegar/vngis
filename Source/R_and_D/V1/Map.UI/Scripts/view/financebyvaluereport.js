
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
    accountManagerApp.callApi(urls.loadproductvaluereport, 'POST',
        geGoodValueFilter(ids),
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
    $("#div_info").html(desc);
    $('#tab_info').trigger('click');

}

    //--------------------------------------------------------------------------------
    //condition
    //--------------------------------------------------------------------------------
    function geGoodValueFilter(ids) {
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
