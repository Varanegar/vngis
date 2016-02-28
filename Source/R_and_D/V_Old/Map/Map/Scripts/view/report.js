
$(document).ready(function () {
    order_init();
    factor_init();
    not_visit_init();
    not_order_init();
    visitor_init();
    car_init();
    customer_init();
    area_init();
    road_init();

    
    $("#ddl_visitorgroup").on("change", function (event) {
        var VisitorGroupValues = $("#ddl_visitorgroup").val();
        $("#ddl_visitor").empty();
        $.ajax({
            type: "POST",
            url: "/Report/FetchVisitorByGroupId",
            dataType: "json",
            data: { grpId: VisitorGroupValues },
            success: function (data) {

                $.each(data, function (i, ItemDropdown) {
                    $("#ddl_visitor").append
                        ('<option value="' + ItemDropdown.Value + '">' + ItemDropdown.Text + '</option>');

                });
            }
        })
        .done(function (Result) {
        });
    });


    $("#ddl_customergroup").on("change", function (event) {
        var CustomerGroupValues = $("#ddl_customergroup").val();
        $("#ddl_visitor").empty();
        $.ajax({
            type: "POST",
            url: "/Report/FetchCustomerByGroupId",
            dataType: "json",
            data: { grpId: CustomerGroupValues, title: '' },
            success: function (data) {

                $.each(data, function (i, ItemDropdown) {
                    $("#ddl_customer").append
                        ('<option value="' + ItemDropdown.Value + '">' + ItemDropdown.Text + '</option>');

                });
            }
        })
        .done(function (Result) {
        });
    });


    $("#ddl_goodgroup").on("change", function (event) {
        var GoodGroupValues = $("#ddl_goodgroup").val();
        $("#ddl_good").empty();
        $.ajax({
            type: "POST",
            url: "/Report/FetchGoodByGroupId",
            dataType: "json",
            data: { grpId: GoodGroupValues },
            success: function (data) {

                $.each(data, function (i, ItemDropdown) {
                    $("#ddl_good").append
                        ('<option value="' + ItemDropdown.Value + '">' + ItemDropdown.Text + '</option>');

                });
            }
        })
        .done(function (Result) {
        });
    });

    $("#btn_run").on("click", function (e) {
        $("#Report_Map").show();
        new $.jmelosegui.GoogleMap('#mapContainer').ajax({
            url: 'GooglemapPartialView',
            type: "Get",
            data: aditionaldata(),
            success: function (data) {
                //alert('succeded');
            }
        });
    });
    
    $("#btn_lists").on("click", function (event) {
        if ($("#pnl_lists").is(':hidden')) {
            $("#pnl_map").removeClass("col-md-11");
            $("#pnl_map").addClass("col-md-8");
            $("#pnl_tab_lists").removeClass("col-md-1");
            $("#pnl_tab_lists").addClass("col-md-4");
            $("#i_btn_lists").addClass("glyphicon-chevron-right");
            $("#i_btn_lists").removeClass("glyphicon-chevron-left");

            $("#pnl_lists").show();

        } else {
            $("#pnl_map").removeClass("col-md-8");
            $("#pnl_map").addClass("col-md-11");
            $("#pnl_tab_lists").removeClass("col-md-4");
            $("#pnl_tab_lists").addClass("col-md-1");
            $("#i_btn_lists").addClass("glyphicon-chevron-left");
            $("#i_btn_lists").removeClass("glyphicon-chevron-right");

            $("#pnl_lists").hide();
        }
    });
    $("#btn_lists").click();
});


function order_init() {
    $("#btn_order").on("click", function (event) {
        if ($("#pnl_order").is(':hidden')) {
            $("#pnl_order").modal('show'); //slideDown(1000);
        } else {
            $("#pnl_order").modal('toggle');
        }
    });
    
    $("#btn_order_chk").on("click", function (event) {
        $("#pnl_order").modal('toggle');
        $("#btn_order").addClass("chk_selected");
        $("#chk_order").val("true");
    });

    $("#btn_order_not_chk").on("click", function (event) {
        $("#pnl_order").modal('toggle');
        $("#btn_order").removeClass("chk_selected");
        $("#chk_order").val("false");

    });

    $("#pnl_order").hide();
    $("#order_from_date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });
    $("#order_to_date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });
   

    var grid = $("#order_grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Report/GetOrderList",
                    type: "POST",
                    //data: { id: Value }
                },
            },

            pageSize: 20,
            serverPaging: true,
            //serverFiltering: true,
            //serverSorting: true
        },
        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,
       
        columns: [{
            field: "Text",
            title: 'تاریخ',
        }, {
            field: "",
            title: 'شماره',
        }, {
            field: "",
            title: 'مبلغ',
        },
            {
                field: "",
                title: 'مشتری',
            }
        ]
    });
}


function factor_init() {
    $("#btn_factor").on("click", function (event) {
        if ($("#pnl_factor").is(':hidden')) {
            $("#pnl_factor").modal('show'); //slideDown(1000);
        } else {
            $("#pnl_factor").modal('toggle');
        }
    });

    $("#btn_factor_chk").on("click", function (event) {
        $("#pnl_factor").modal('toggle');
        $("#btn_factor").addClass("chk_selected");
        $("#chk_factor").val("true");
    });

    $("#btn_factor_not_chk").on("click", function (event) {
        $("#pnl_factor").modal('toggle');
        $("#btn_factor").removeClass("chk_selected");
        $("#chk_factor").val("false");
    });

    $("#pnl_factor").hide();
    $("#factor_from_date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });
    $("#factor_to_date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });
}


function not_visit_init() {
    $("#btn_not_visit").on("click", function (event) {
        if ($("#chk_not_visit").val() == "true") {
            $("#chk_not_visit").val("false");
            $("#btn_not_visit").removeClass("chk_selected");
            $("#btn_run").focus();
        } else {
            $("#chk_not_visit").val("true");
            $("#btn_not_visit").addClass("chk_selected");
            $("#btn_run").focus();
        }
    });
}

function not_order_init() {
    $("#btn_not_order").on("click", function (event) {
        if ($("#chk_not_order").val() == "true") {
            $("#chk_not_order").val("false");
            $("#btn_not_order").removeClass("chk_selected");
            $("#btn_run").focus();
        } else {
            $("#chk_not_order").val("true");
            $("#btn_not_order").addClass("chk_selected");
            $("#btn_run").focus();
        }
    });
}

function visitor_init() {
    $("#pnl_visitor").hide();

    $("#btn_visitor").on("click", function (event) {
        $("#pnl_visitor").modal('show');
    });
    
    $("#btn_visitor_chk").on("click", function (event) {
        $("#pnl_visitor").modal('toggle');
        $("#btn_visitor").addClass("chk_selected");
        $("#chk_visitor").val("true");
    });

    $("#btn_visitor_not_chk").on("click", function (event) {
        $("#pnl_visitor").modal('toggle');
        $("#btn_visitor").removeClass("chk_selected");
        $("#chk_visitor").val("false");
    });


}

function car_init() {
    $("#btn_car").on("click", function (event) {
        if ($("#chk_car").val() == "true") {
            $("#chk_car").val("false");
            $("#btn_car").removeClass("chk_selected");
            $("#btn_run").focus();
        } else {
            $("#chk_car").val("true");
            $("#btn_car").addClass("chk_selected");
            $("#btn_run").focus();
        }
    });
}

function customer_init() {
    $("#pnl_customer").hide();
    
    $("#btn_customer").on("click", function (event) {
            $("#pnl_customer").modal('show'); 
    });

    $("#btn_customer_chk").on("click", function (event) {
        $("#pnl_customer").modal('toggle');
        $("#btn_customer").addClass("chk_selected");
        $("#chk_customer").val("true");
    });

    $("#btn_customer_not_chk").on("click", function (event) {
        $("#pnl_customer").modal('toggle');
        $("#btn_customer").removeClass("chk_selected");
        $("#chk_customer").val("false");
    });

    var grid = $("#customer_grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Report/GetCustomerList",
                    type: "POST",
                    //data: { id: Value }
                },
            },

            pageSize: 20,
            serverPaging: true,
            //serverFiltering: true,
            //serverSorting: true
        },
        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,

        columns: [{
            field: "Text",
            title: 'عنوان',
        }, {
            field: "",
            title: 'نوع فعالیت',
        }, {
            field: "",
            title: 'آدرس',
        }
        ]
    });

}

function area_init() {
    $("#pnl_area").hide();

    $("#btn_area").on("click", function (event) {
        if ($("#pnl_area").is(':hidden')) {
            $("#pnl_area").show(1000);

        } else {
            $("#pnl_area").hide(1500);
        }
    });

   
    $("#ddl_area_group").on("change", function (event) {
        var val = $("#ddl_area_group").val();
        if (val != 0) {
            $("#chk_area").val("true");
            $("#btn_area").addClass("chk_selected");
        } else {
            $("#chk_area").val("false");
            $("#btn_area").removeClass("chk_selected");
        }
    });
}

function road_init() {
    $("#pnl_road").hide();

    $("#btn_road").on("click", function (event) {
        if ($("#pnl_road").is(':hidden')) {
            $("#pnl_road").show(1000);
          
        } else {
            $("#pnl_road").hide(1500);           
        }
    });

    $("#ddl_road_group").on("change", function (event) {
        var val = $("#ddl_road_group").val();
        if (val != 0) {
            $("#chk_road").val("true");
            $("#btn_road").addClass("chk_selected");
        } else {
            $("#chk_road").val("false");
            $("#btn_road").removeClass("chk_selected");
        }
    });



}


function aditionaldata() {
    return {
        Order: $("#chk_order").val() == "true",
        Factor: $("#chk_factor").val() == "true",
        NotOrdered: $("#chk_not_order").val() == "true",
        Customer: $("#chk_customer").val() == "true",
        Machin: $("#chk_car").val() == "true",

        NotVisit: $("#chk_not_visit").val() == "true",
        MachinPath: true,//$("#chk_car_path").is(':checked'),
        Visitor: $("#chk_visitor").val() == "true",
        VisitorPath: $("#chk_visitor_path").val() == "true",
        Limited: $("#chk_area").val() == "true",
        Road: $("#chk_road").val() == "true",

        FromDate: $("#order_from_date").val(),
        ToDate: $("#order_to_date").val(),
        FromTime: '',
        ToTime: '',
        VisitorGroupId: $("#ddl_visitorgroup").val(),
        VisitorId: $("#ddl_visitor").val(),
        CustomerGroupId: $("#ddl_customergroup").val(),
        CustomerId: $("#ddl_customer").val(),
        GoodGroupId: $("#ddl_goodgroup").val(),
        GoodId: $("#ddl_good").val(),
        DriverId: 0,//$("#ddl_driver").val(),
        DistributerId: 0,//$("#ddl_distributer").val(),
        FromRoadId: 0,//$("#ddl_from_road").val(),
        ToRoadId: 0, //$("#ddl_to_road").val(),
        DistributArea: '', //$("#txt_distribut_area").val(),
        Area: '' //$("#txt_area").val()
    };
}