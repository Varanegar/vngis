
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
            field: "uniqueId",
            headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_visitor\")'  style: 'width:10px;'/>",
            template: "<input type='checkbox' value='#=uniqueId#' onchange='updateMasterCheckbox(\"grid_visitor\")' id=" + "chk" + "#=uniqueId#" + " class='checkboxGrid'/>",
            width:20
        }, {
                    field: "title",
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
        if ((value != "") && (value != null) && (value != undefined)) {
            accountManagerApp.callApi(urls.loadlareabyevel, 'POST',
                { regionAreaLevel: 2, regionAreaId: value },
                function (data) {
                    addItemsToDroupdown({ elementId: "ddl_team", data: data, addSelectRow: true });
                });
        }
        
    });

    $("#ddl_team").on("change", function (event) {
        var value = $("#ddl_team").val();
        if ((value != "") && (value != null) && (value != undefined)) {
            accountManagerApp.callApi(urls.loadvisitorgroupbyareaid, 'POST',
                { regionAreaId: value },
               function (data) {
                   addItemsToDroupdown({ elementId: "ddl_visitor_group", data: data, addSelectRow: true });
               });
        }

    });

    $("#ddl_visitor_group").on("change", function (event) {        
        $('#grid_visitor').data('kendoGrid').dataSource.read();
        $('#grid_visitor').data('kendoGrid').refresh();
    });

    $("#btn_run").on("click", function (e) {
        clearOverlays();
        drawMarkers();
        drawVisitorsPath();
        drawDailyPath();

    });

});

//-------------------------------------
function drawMarkers() {
    accountManagerApp.callApi(urls.loadpersonelactivity, 'POST',
       {
           personelIds: getSelectedIds("grid_visitor"),
           date: $("#dte_date").val(),
           order: $("#chk_order").is(":checked"),
           lackOrder: $("#chk_lack_order").is(":checked"),
           lackVisit: $("#chk_lack_visit").is(":checked"),
           stopWithoutCustomer: $("#chk_wait").is(":checked"),
           stopWithoutActivity: $("#chk_without_activity").is(":checked")
       },
    function (data) {
        $.each(data, function (i, item) {
            var m = addMarker({
                id: "marker_" + item.uniqueId,
                fit: true,
                lat: item.latitude, lng: item.longitude,
                clustering: true, label: item.lable
            });

            var icon = "marker0";
            var color = "";

            var eventdesc = "";
                 if (item.pointType == customerPoint) { icon = "customer"; }
            else if (item.pointType == gpsOffEvent) { icon = "gpsoff"; }
            //else if (item.subType == 3 /*(int)ESubType.DISTANCE*/) { icon = "distance"; }

            else if (item.pointType.toLowerCase() == orderEvent.toLowerCase()) {
                     icon = "order";
                     eventdesc = getOrderHtml(item.jData);
                 }
            else if (item.pointType.toLowerCase() == lackOfVisitEvent.toLowerCase()) {
                     icon = "lackvisit";
                     eventdesc = getLackOfVisitHtml(item.jData);
                 }
            else if (item.pointType.toLowerCase() == lackOfOrderEvent.toLowerCase()) {
                    icon = "lackorder";
                    eventdesc = getLackOfOrderHtml(item.jData);
                }
            else if (item.pointType.toLowerCase() == stopWithoutCustomerEvent.toLowerCase()) { icon = "withoutcustomer"; }
            //else if (item.pointType == 4 /*PointType.StopWithoutActivity*/) { icon = "withoutactivity"; }
            //else if (item.pointType == 6 /*PointType.OuteLine*/) { icon = "outeline"; }

            //if (item.subType == 2 /*(int)ESubType.NEW*/) { color = "1"; }


            m.setIcon({ url: "../../Content/img/pin/" + icon + ".png", size: MarkersIcon.Event.Size, anchor: MarkersIcon.Event.Anchor });
            if (eventdesc != "") {
                m.addListener('click', function (e) {
                    closeInfoWindow();
                    openInfoWindow(new google.maps.LatLng(item.latitude, item.longitude), eventdesc);
                    
                });
            }


            //}
        });
        renderClusterMarkers();
        fitPointBounds();
    });
}

function drawVisitorsPath() {
    accountManagerApp.callApi(urls.loadpersonelpath, 'POST',
        {
            personelIds: getSelectedIds("grid_visitor"),
            date: $("#dte_date").val()
        },
        function (data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            var m = addMarker({
                                id: "point" + item.id,
                                fit: true,
                                lat: item.latitude, lng: item.longitude,
                                clustering: false, windowdesc: "<br/>"+item.desc
                            });
                            m.setIcon({ url: MarkersIcon.Point.Url, size: MarkersIcon.Point.Size, anchor: MarkersIcon.Point.Anchor });

                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: line.Color, weight: 2, direction: true });
                    }
                });
            }
    });
}

function drawDailyPath() {
    accountManagerApp.callApi(urls.loadpersonelprogrampath, 'POST',
        {
            personelIds: getSelectedIds("grid_visitor"),
            date: $("#dte_date").val()
        },
        function(data) {
            if (data != null) {
                $.each(data, function(i, line) {
                    var arealine = [];
                    if (line.points != null)
                        $.each(line.points, function(j, item) {
                            arealine.push(new google.maps.LatLng(item.latitude, item.longitude));
                        });
                    if (arealine.length > 0) {
                        addPolyline({ line: arealine, color: '#ff0000', weight: 2, direction: true });
                    }
                });
            }
        });
}
//--------------------------------------
function loadLevel1Area() {
    accountManagerApp.callApi(urls.loadlareabyevel, 'POST',
        { regionAreaLevel: 1 },
        function(data) {
            addItemsToDroupdown({elementId:"ddl_area", data : data, addSelectRow : true });
        });
}


function loadVisitorByGroupid(options)
{
    if ($("#ddl_visitor_group").val() != null) {
        accountManagerApp.callApi(urls.loadpersonelbygroupid, 'POST',
            { groupId: $("#ddl_visitor_group").val() },
            function (result) {
                options.success(result);
            });
    }
}
    
function onMapLoadHandler(args) {
    for (var mark in args.markers) {
       args.markers[mark].setLabel(args.markers[mark].title);
    }
}
