﻿var selectedIds = [];

$(document).ready(function () {
    $("#pnl_marker").hide();
    
    $("#dte_date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });

    $("#tim_from").kendoTimePicker({
       
    });
    $("#tim_to").kendoTimePicker({

    });

    $("#grid_visitor").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/visitor/LoadVisitorByGroupId",
                    data: grid_aditionaldata,
                    type: "POST"
                },
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
            headerTemplate: "<input id='mastercheckbox' type='checkbox'/>",
            template: "<input type='checkbox' value='#=Id#' onchange='change_id_list(" + 'this' + ",#=Id#)' id=" + "chk" + "#=Id#" + " class='checkboxGroups'/>",
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
            url: "LoadVisitorGroupByAreaId",
            dataType: "json",
            data: { areaId: value },
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

function grid_aditionaldata() {
    return { groupId: $("#ddl_visitor_group").val() };
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
        var masterBox = $('#mastercheckbox');
        if (masterBox.is(":checked")) {
            masterBox.prop('checked', false);
        }

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
        Wait: $("#chk_wait").is(":checked"),
        WithoutActivity: $("#chk_without_activity").is(":checked")
    };    
}