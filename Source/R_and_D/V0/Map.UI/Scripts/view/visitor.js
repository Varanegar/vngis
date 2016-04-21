var line_load = true;
var marker_load = true;

$(document).ready(function () {

    $("#pnl_marker").hide();

    kendo.culture("fa-IR");
    var date = new JalaliDate();
    $("#dte_date").kendoDatePicker({
        format: "yyyy/MM/dd"
    }).val(date.toFullDateString());

    $("#tim_from").kendoTimePicker({
        format: "HH:mm",
        value:"00:00"
       
    });
    $("#tim_to").kendoTimePicker({
        format: "HH:mm",
        value:"24:00"
});

    loadLevel1Area();

    $("#grid_visitor").kendoGrid({
        autoBind: false,
        height:440,
        dataSource: {
            transport: {
                read: loadVisitorByGroupid
            },
            pageSize: 30,
            serverPaging: false,
            //serverFiltering: true,
            //serverSorting: true
        },

        sortable: false,
        editable: false,
        selectable: "row",
        pageable: false,
        scrollable: true,
        columns: [
        {
            field: "Id",
            headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_visitor\")'  style: 'width:10px;'/>",
            template: "<input type='checkbox' value='#=Id#' onchange='updateMasterCheckbox(\"grid_visitor\")' id=" + "chk" + "#=Id#" + " class='checkboxGrid'/>",
            width:20
        }, {
                    field: "Title",
                    title: 'عنوان',
        }
        ]
    });

    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });

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
    });

    $("#btn_run").on("click", function (e) {
        showWating();
        clearOverlays();
        drawMarkers();
        drawVisitorsPath();
    });

});

//-------------------------------------
function drawMarkers() {
    marker_load = false;
    $.ajax({
        type: "POST",
        url: url_loadmarkers,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            VisitorIds: getSelectedIds("grid_visitor"),
            Date: $("#dte_date").val(),
            Order: $("#chk_order").is(":checked"),
            LackOrder: $("#chk_lack_order").is(":checked"),
            LackVisit: $("#chk_lack_visit").is(":checked"),
            StopWithoutCustomer: $("#chk_wait").is(":checked"),
            StopWithoutActivity: $("#chk_without_activity").is(":checked")
        }),
        success: function (data) {
            $.each(data, function (i, item) {
                var _m = addMarker({
                    id: "marker_" + item.Id,
                    fit: true,
                    lat: item.Latitude, lng: item.Longitude,
                    windowdesc: item.Desc, clustering: true, label: item.Lable
                });


                var icon = "marker0";
                var color = "";
                if ((item.PointType == 5 /*PointType.Customer*/) || (item.PointType == 7 /*PointType.GpsOff*/))
                {
                    if (item.PointType == 5 /*PointType.Customer*/){ icon = "customer"; }
                    else if (item.PointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }
                        
                    _m.setIcon("../../Content/img/pin/" + icon + ".png", new google.maps.Size(16, 16), new google.maps.Point(0, 0)
                        , new google.maps.Point(8, 8));
                }
                else
                {
                        if (item.SubType == 1 /*(int)ESubType.OUTE_LINE*/) { icon = "outeline"; }
                    else if (item.SubType == 3 /*(int)ESubType.DISTANCE*/) { icon = "distance"; }
                    else if (item.PointType == 0 /*PointType.Order*/) { icon = "order"; }
                    else if (item.PointType == 2 /*PointType.LackOfVisit*/) { icon = "lackvisit"; }
                    else if (item.PointType == 1 /*PointType.LackOfOrder*/) { icon = "lackorder"; }
                    else if (item.PointType == 3 /*PointType.StopWithoutCustomer*/) { icon = "withoutcustomer"; }
                    else if (item.PointType == 4 /*PointType.StopWithoutActivity*/) { icon = "withoutactivity"; }
                    else if (item.PointType == 6 /*PointType.OuteLine*/) { icon = "outeline"; }

                    if (item.SubType == 2 /*(int)ESubType.NEW*/ ) { color = "1"; }

                    

                    _m.setIcon({ url: "../../Content/img/pin/" + icon + color + ".png", size: new google.maps.Size(10, 10), anchor: new google.maps.Point(5, 5) });

                    //test
                    //if (item.PointType == 2) {                        
                    //    _m.setIcon({ url: "../../Content/img/pin/test.gif" });
                    //}

                }
            });
            renderClusterMarkers();
            fitPointBounds();
        }
    }).always(function () {
        marker_load = true;
        if (line_load)
            hideWating();
    });

}

function drawVisitorsPath() {
    line_load = false;
    $.ajax({
        type: "POST",
        url: url_loadvisitorspath,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            VisitorIds: getSelectedIds("grid_visitor"),
            Date: $("#dte_date").val(),
            DailyPath: $("#chk_daily_path").is(":checked"),
            VisitorPath: true // $("#chk_visitor_path").is(":checked"),
        }),
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: line.Color, weight: 2, direction: true });
                    }
                });
            }
        }
    }).always(function () {
        line_load = true;
         if (marker_load)
            hideWating();
    });
}
//--------------------------------------
function loadLevel1Area() {
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


function loadVisitorByGroupid(options)
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
    
function onMapLoadHandler(args) {
    for (var mark in args.markers) {
       args.markers[mark].setLabel(args.markers[mark].title);
    }
}
