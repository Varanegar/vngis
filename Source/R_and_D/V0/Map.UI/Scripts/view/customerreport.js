var areaId;

$(document).ready(function () {
    areaId = '';

    $("#div_advance_condition").hide();

    kendo.culture("fa-IR");
    var date = new JalaliDate();
    $("#dte_from").kendoDatePicker({
        format: "yyyy/MM/dd"
    }).val(date.toFullDateString());
    $("#dte_to").kendoDatePicker({
        format: "yyyy/MM/dd"
    }).val(date.toFullDateString());

    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });

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

});

function back(id) {
    areaId = id;
    refreshMap();
}

function refreshMap() {
    if ((areaId != null)&&(areaId != undefined)) {
        $.ajax({
            type: "POST",
            url: url_getareapath,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Id: areaId }),
            success: function (data) {
                var list = "<button id = 'btn_back_0' class='btn btn-link color-gray' onclick='back(0)' > خانه</button>";
                for (var i = data.length - 1 ; i >= 0 ; i--) {
                    list += ">> <button id = 'btn_back_'" + data[i].Id + " class='btn btn-link color-gray' onclick=back('" + data[i].Id + "') >" + data[i].Title + "</button> ";
                }
                location.hash = areaId;
                $("#pnl_path").html(list);
            }
        });
    }
    else {
        $("#pnl_path").html("");
    }
    clearOverlays();
    drawAreaInfo();

}

function getFilter() {
    return{
        ParentId: areaId,
        FromDate: $("#dte_from").val(),
        ToDate : $("#dte_to").val(),
        SaleOffice :$("#ddl_sale_office").val(),
        Header :$("#ddl_header").val(),
        Seller :$("#ddl_seller").val(),
        CustomerClass : $("#ddl_customer_class").val(),
        CustomerActivity : $("#ddl_customer_activity").val(),
        CustomerDegree : $("#ddl_customer_degree").val(),
        GoodGroup : $("#ddl_good_group").val(),
        DynamicGroup : $("#ddl_dynamic_group").val(),
        Good : $("#ddl_good").val(),
        CommercialName : $("#txt_commercial_good_name").val(),
        DayCount : $("#txt_day_not_visit").val(),
        ActiveCustomerCount : $("#chk_active_customer_count").is(":checked"),
        VisitCount : $("#chk_visit_count").is(":checked"),
        LackOfVisitCount : $("#chk_lack_of_visit").is(":checked"),
        LackOfSaleCount : $("#chk_lack_of_sale").is(":checked"),
        NewCustomerCount : $("#chk_new_customer_count").is(":checked"),
        DuringCheck : $("#chk_during_check").is(":checked"),
        RejectCheck : $("#chk_reject_check").is(":checked")
       }
}

function drawAreaInfo() {
    $.ajax({
        type: "POST",
        url: url_loadcustomerreport,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(getFilter()),
        success: function (data) {
            if (data != null) {
                $.each(data, function (i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function (j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                       poly = addPolygon({
                            line: arealine,
                            color: '#777777',
                            lable: line.Lable,
                            windowdesc: line.Desc,
                            showWindowAlways : true,
                            fit: true
                       });

                       poly.addListener('click', function (event) {
                           areaId = line.MasterId;
                           refreshMap();
                       });

                    }
                })
                fitPointBounds();

            }
        }
    });

}