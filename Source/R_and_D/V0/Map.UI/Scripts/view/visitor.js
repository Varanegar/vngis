var selectedIds = [];

$(document).ready(function () {
    //$("#pnl_marker").hide();

    
    kendo.culture("fa-IR");
    var date = new JalaliDate();
    $("#dte_date").kendoDatePicker({

        format: "yyyy/MM/dd",
        value: date.jalalidate
    });

    $("#tim_from").kendoTimePicker({
        format: "HH:mm"
       
    });
    $("#tim_to").kendoTimePicker({
        format: "HH:mm"
    });

    load_level1_area();

    $("#grid_visitor").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: load_visitor_by_groupid
            },
            pageSize: 30,
            serverPaging: true,
            //serverFiltering: true,
            //serverSorting: true
        },

        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: false,
        columns: [
        {
            field: "Id",
            title: " ",
            template: "<input type='checkbox' value='#=Id#' onchange=change_id_list(" + 'this' + ",'#=Id#') id=" + "chk" + "#=Id#" + " class='checkboxGroups'/>",
            attributes: { style: "width:5%;" }
        }, {
                    field: "Title",
                    title: 'عنوان',
        }
        ]
    });


    $("#btn_marker").on("click", function (e) {
        if ($("#pnl_marker").is(':hidden')) {
            $("#pnl_marker").show(500);
            $("#spn_marker").removeClass("glyphicon-chevron-down");
            $("#spn_marker").addClass("glyphicon-chevron-up");
        } else {
            $("#pnl_marker").hide(500);
            $("#spn_marker").removeClass("glyphicon-chevron-up");
            $("#spn_marker").addClass("glyphicon-chevron-down");
        }
    });

    $("#ddl_area").on("change", function (event) {
        var value = $("#ddl_area").val();
        $("#ddl_visitor_group").empty();
        $.ajax({
            type: "POST",
            url: url_loadvisitorgroupbyareaid,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Id: value }),
            success: function (data) {
                $.each(data, function (i, ItemDropdown) {
                    $("#ddl_visitor_group").append
                        ('<option value="' + ItemDropdown.Id + '">' + ItemDropdown.Title + '</option>');
                });
            }
        })
        .done(function (Result) {
        });       
    });
    
    $("#ddl_visitor_group").on("change", function (event) {        
        $('#grid_visitor').data('kendoGrid').dataSource.read();
        $('#grid_visitor').data('kendoGrid').refresh();
        selectedIds = [];
    });

    $("#btn_run").on("click", function (e) {
        new $.jmelosegui.GoogleMap('#mapContainer').ajax({
            url: 'GooglemapVisitorView',
            type: "Post",
            data: map_aditionaldata(),
            success: function (data) {
                //alert('succeded');
            }
        });
    });

});


function load_level1_area() {
    $("#ddl_area").empty();
    $.ajax({
        type: "POST",
        url: url_loadlevel1area,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, ItemDropdown) {
                $("#ddl_area").append
                    ('<option value="' + ItemDropdown.Id + '">' + ItemDropdown.Title + '</option>');
            });
        }
    });
}


function load_visitor_by_groupid(options)
{
    if ($("#ddl_visitor_group").val() != null) {
        $.ajax({
            type: "POST",
            url: url_loadvisitorbygroupid,
            data: JSON.stringify({ Id: $("#ddl_visitor_group").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                options.success(result);
            }
        });
    }
}
    

function change_id_list(e, id) {
    var flag = e.checked;

    if (flag) {
        try {
            selectedIds.push(id);
        } catch (e) {
            selectedIds = [id];
        }

    } else {

        var idtoDelete = 0;
        for (var i = 0; i < selectedIds.length; i++) {
            if (selectedIds[i] == id) idtoDelete = i;
        }
        selectedIds.splice(idtoDelete, 1);
    }
}


function map_aditionaldata() {
    return {
        VisitorIds: selectedIds,
        Date: $("#dte_date").val(),
        DailyPath: $("#chk_daily_path").is(":checked"),
        VisitorPath: $("#chk_visitor_path").is(":checked"),
        Order: $("#chk_order").is(":checked"),
        LackOrder: $("#chk_lack_order").is(":checked"),
        LackVisit: $("#chk_lack_visit").is(":checked"),
        StopWithoutCustomer: $("#chk_wait").is(":checked"),
        StopWithoutActivity: $("#chk_without_activity").is(":checked")
    };    
}

function onMapLoadHandler(args) {
    for (var mark in args.markers) {
       args.markers[mark].setLabel(args.markers[mark].title);
    }
}
