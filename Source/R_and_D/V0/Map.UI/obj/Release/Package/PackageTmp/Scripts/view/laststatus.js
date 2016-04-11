var selectedIds = [];

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
        scrollable: false,
        columns: [
        {
            field: "Id",
            headerTemplate: "<input id='mastercheckbox' type='checkbox'/>",
            template: "<input type='checkbox' value='#=Id#' onchange=changeIdList(" + 'this' + ",'#=Id#') id=" + "chk" + "#=Id#" + " class='checkboxGroups'/>",
            attributes: { style: "width:5%;" }
        }, {
            field: "Title",
            title: 'عنوان',
        }
        ]
    });

    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });
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
        clearOverlays();

        drawLastStatusMarkers();
    });


    $('#mastercheckbox').click(function () {
        $('.checkboxGroups').attr('checked', $(this).is(':checked')).change();
    });


});


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


function loadVisitorByGroupid(options) {
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


function changeIdList(e, id) {
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
    updateMasterCheckbox();
}

function updateMasterCheckbox() {
    var numChkBoxes = $('#grid_visitor input[type=checkbox][id!=mastercheckbox]').length;
    var numChkBoxesChecked = $('#grid_visitor input[type=checkbox][checked][id!=mastercheckbox]').length;
    $('#mastercheckbox').attr('checked', numChkBoxes == numChkBoxesChecked && numChkBoxes > 0);
}

function drawLastStatusMarkers() {
    $.ajax({
        type: "POST",
        url: url_loadlaststatusmarkers,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            VisitorIds: selectedIds
        }),
        success: function (data) {
            $.each(data, function (i, item) {
                var _m = addMarker({
                    id: "marker_" + item.Id,
                    fit:true,
                    lat: item.Latitude, lng: item.Longitude,
                    windowdesc: item.Desc, clustering: true, label: item.Lable
                });


                var icon = "marker0";
                var color = "";
                if ((item.PointType == 5 /*PointType.Customer*/) || (item.PointType == 7 /*PointType.GpsOff*/)) {
                    if (item.PointType == 5 /*PointType.Customer*/) { icon = "customer"; }
                    else if (item.PointType == 7 /*PointType.GpsOff*/) { icon = "gpsoff"; }

                    _m.setIcon("../../Content/img/pin/" + icon + ".png", new google.maps.Size(16, 16), new google.maps.Point(0, 0)
                        , new google.maps.Point(8, 8));
                }
                else {
                    if (item.SubType == 1 /*(int)ESubType.OUTE_LINE*/) { icon = "outeline"; }
                    else if (item.SubType == 3 /*(int)ESubType.DISTANCE*/) { icon = "distance"; }
                    else if (item.PointType == 0 /*PointType.Order*/) { icon = "order"; }
                    else if (item.PointType == 2 /*PointType.LackOfVisit*/) { icon = "lackvisit"; }
                    else if (item.PointType == 1 /*PointType.LackOfOrder*/) { icon = "lackorder"; }
                    else if (item.PointType == 3 /*PointType.StopWithoutCustomer*/) { icon = "withoutcustomer"; }
                    else if (item.PointType == 4 /*PointType.StopWithoutActivity*/) { icon = "withoutactivity"; }
                    else if (item.PointType == 6 /*PointType.OuteLine*/) { icon = "outeline"; }


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
    });
}