var line_load = true;
var marker_load = true;
var line_load_daily = true;

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

    initMap('mapContainer', MapCenterPosition);

    $("#btn_marker").on("click", function (e) {
        if ($("#pnl_marker").is(':hidden')) {
            $("#pnl_marker").show();
            $("#spn_marker").removeClass("glyphicon-chevron-down");
            $("#spn_marker").addClass("glyphicon-chevron-up");
            $("#grid_visitor .k-grid-content").height($("#grid_visitor .k-grid-content").height() - $("#pnl_marker").height());
            $("#grid_visitor").height($("#grid_visitor").height() - $("#pnl_marker").height());
        } else {
            $("#pnl_marker").hide();
            $("#spn_marker").removeClass("glyphicon-chevron-up");
            $("#spn_marker").addClass("glyphicon-chevron-down");
            
            $("#grid_visitor .k-grid-content").height($("#grid_visitor .k-grid-content").height() + $("#pnl_marker").height());
            $("#grid_visitor").height($("#grid_visitor").height() + $("#pnl_marker").height());
            
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
                addItemsToDroupdown("ddl_visitor_group",data);               
            }
        })
        .done(function (result) {
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
        drawDailyPath();

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
                var m = addMarker({
                    id: "marker_" + item.Id,
                    fit: true,
                    lat: item.Latitude, lng: item.Longitude,
                    windowdesc: item.Desc, clustering: true, label: item.Lable
                });

                var icon = "marker0";
                var color = "";
                //if ((item.PointType == 5 /*PointType.Customer*/) || (item.PointType == 7 /*PointType.GpsOff*/))
                //{
                //    if (item.PointType == 5 /*PointType.Customer*/){ icon = "customer"; }
                //    else if (item.PointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }
                        
                //    m.setIcon("../../Content/img/pin/" + icon + ".png", new google.maps.Size(16, 16), new google.maps.Point(0, 0)
                //        , new google.maps.Point(8, 8));
                //}
                //else
                //{
                    if (item.SubType == 1 /*(int)ESubType.OUTE_LINE*/) { icon = "outeline"; }
                    else if (item.PointType == 5 /*PointType.Customer*/) { icon = "customer"; }
                    else if (item.PointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }
                    else if (item.SubType == 3 /*(int)ESubType.DISTANCE*/) { icon = "distance"; }
                    else if (item.PointType == 0 /*PointType.Order*/) { icon = "order"; }
                    else if (item.PointType == 2 /*PointType.LackOfVisit*/) { icon = "lackvisit"; }
                    else if (item.PointType == 1 /*PointType.LackOfOrder*/) { icon = "lackorder"; }
                    else if (item.PointType == 3 /*PointType.StopWithoutCustomer*/) { icon = "withoutcustomer"; }
                    else if (item.PointType == 4 /*PointType.StopWithoutActivity*/) { icon = "withoutactivity"; }
                    else if (item.PointType == 6 /*PointType.OuteLine*/) { icon = "outeline"; }

                    if (item.SubType == 2 /*(int)ESubType.NEW*/ ) { color = "1"; }

                    m.setIcon({ url: "../../Content/img/pin/" + icon + color + ".png", size: MarkersIcon.Event.Size, anchor: MarkersIcon.Event.Anchor });

                //}
            });
            renderClusterMarkers();
            fitPointBounds();
        }
    }).always(function () {
        marker_load = true;
        if (line_load && line_load_daily)
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
            DailyPath: false,
            VisitorPath: true // $("#chk_visitor_path").is(":checked"),
        }),
        success: function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.Points != null)
                        $.each(line.Points, function(j, item) {
                            var m = addMarker({
                                id: "point" + item.Id,
                                fit: true,
                                lat: item.Latitude, lng: item.Longitude,
                                clustering: false, windowdesc: "<br/>"+item.Desc
                            });
                            m.setIcon({ url: MarkersIcon.Point.Url, size: MarkersIcon.Point.Size, anchor: MarkersIcon.Point.Anchor });

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
        if (marker_load && line_load_daily)
            hideWating();
    });
}

function drawDailyPath() {
    line_load_daily = false;
    if ($("#chk_daily_path").is(":checked") == true) {
        $.ajax({
            type: "POST",
            url: url_loadvisitorspath,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                VisitorIds: getSelectedIds("grid_visitor"),
                Date: $("#dte_date").val(),
                DailyPath: $("#chk_daily_path").is(":checked"),
                VisitorPath: false // $("#chk_visitor_path").is(":checked"),
            }),
            success: function(data) {
                if (data != null) {
                    $.each(data, function(i, line) {
                        var arealine = [];
                        if (line.Points != null)
                            $.each(line.Points, function(j, item) {
                                arealine.push(new google.maps.LatLng(item.Latitude, item.Longitude));
                            });
                        if (arealine.length > 0) {
                            addPolyline({ line: arealine, color: '#888888', weight: 2, direction: true });
                        }
                    });
                }
            }
        }).always(function() {
            line_load_daily = true;
            if (marker_load && line_load_daily)
                hideWating();
        });

    } else {
        line_load_daily = true;
    }
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
