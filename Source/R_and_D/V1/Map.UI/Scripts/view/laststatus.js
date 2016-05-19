
$(document).ready(function () {
    loadLevel1Area();
    $("#grid_visitor").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: loadVisitorByGroupid
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
        scrollable: true,
        dataBound: dataBound,
        height:400,
        columns: [
        {
            field: "uniqueId",
            headerTemplate: "<input id='mastercheckbox' type='checkbox' onchange='mastercheckboxChange(this, \"grid_visitor\")' />",
            template: "<input type='checkbox' value='#=uniqueId#' onchange='updateMasterCheckbox(\"grid_visitor\")' id=" + "chk" + "#=uniqueId#" + " class='checkboxGrid'/>",
            width: 20
        }, {
            field: "title",
            title: 'عنوان',
        }
        ]
    });

    initMap('mapContainer', MapCenterPosition);

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
        drawLastStatusMarkers();
    });


    $('#mastercheckbox').click(function () {
        $('.checkboxGroups').attr('checked', $(this).is(':checked')).change();
    });


});

function dataBound() {
    $('#mastercheckbox').prop("checked", true).change();
}

//--------------------------------------
function loadLevel1Area() {
    $("#ddl_area").empty();
    accountManagerApp.callApi(urls.loadlareabyevel, 'POST',
        { regionAreaLevel: 1 },
        function (data) {
            addItemsToDroupdown({ elementId: "ddl_area", data: data, addSelectRow: true });
        });
}


function loadVisitorByGroupid(options) {
    if ($("#ddl_visitor_group").val() != null) {
        accountManagerApp.callApi(urls.loadpersonelbygroupid, 'POST',
            { groupId: $("#ddl_visitor_group").val() },
            function (result) {
                options.success(result);
            });
    }
}

function drawLastStatusMarkers() {
    accountManagerApp.callApi(urls.loadlaststatusmarkers, 'POST',
        {personelIds: getSelectedIds("grid_visitor")},
        function (data) {
            $.each(data, function (i, item) {
                var m = addMarker({
                    id: "marker_" + item.id,
                    fit:true,
                    lat: item.latitude, lng: item.longitude,
                    windowdesc: item.desc, clustering: true, label: item.lable
                });


                var icon = "marker0";
                var color = "";
                //if ((item.PointType == 5 /*PointType.Customer*/) || (item.PointType == 7 /*PointType.GpsOff*/)) {
                //    if (item.PointType == 5 /*PointType.Customer*/) { icon = "customer"; }
                //    else if (item.PointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }

                //    _m.setIcon("../../Content/img/pin/" + icon + ".png", new google.maps.Size(16, 16), new google.maps.Point(0, 0)
                //        , new google.maps.Point(8, 8));
                //}
                //else {
                    if (item.subType == 1 /*(int)ESubType.OUTE_LINE*/) { icon = "outeline"; }
                    else if (item.pointType == 5 /*PointType.Customer*/) { icon = "customer"; }
                    else if (item.pointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }
                    else if (item.subType == 3 /*(int)ESubType.DISTANCE*/) { icon = "distance"; }
                    else if (item.pointType == 0 /*PointType.Order*/) { icon = "order"; }
                    else if (item.pointType == 2 /*PointType.LackOfVisit*/) { icon = "lackvisit"; }
                    else if (item.pointType == 1 /*PointType.LackOfOrder*/) { icon = "lackorder"; }
                    else if (item.pointType == 3 /*PointType.StopWithoutCustomer*/) { icon = "withoutcustomer"; }
                    else if (item.pointType == 4 /*PointType.StopWithoutActivity*/) { icon = "withoutactivity"; }
                    else if (item.pointType == 6 /*PointType.OuteLine*/) { icon = "outeline"; }


                    m.setIcon({ url: "../../Content/img/pin/" + icon + color + ".png", size: MarkersIcon.Event.Size, anchor: MarkersIcon.Event.Anchor });


                //}
            });
            renderClusterMarkers();
            fitPointBounds();

        });
}