orderEvent = "E780728B-9BAC-4E86-AFE0-9886AD101128",
lackOfVisitEvent = "E68F7931-2189-4000-B173-D02719720923",
lackOfOrderEvent = "E8ED4D92-CBC0-40F1-A732-53CFF4C91AC5",
stopWithoutCustomerEvent = "3",
customerPoint = "5",
gpsOffEvent = 7,
customerRout = '1B340061-0DFC-490B-9A72-91365916D911',
customerOtherRout = '733E4674-57A3-4013-A6DB-6EF543356E1B',
customerWithoutRout = 'A5BE354A-C0CB-4D47-B159-F156112408F8';

$(document).ready(function() {
    kendo.culture("fa-IR");
    intDateTime();
});

//------------------------------------------------------
//date time
//------------------------------------------------------
function intDateTime() {
    $(".mydate").persianDatepicker({
        cellWidth: 48,
        cellHeight: 32,
        fontSize: 16,
        isRTL: true,
        selectedBefore: true,
        formatDate: "YYYY/0M/0D",
    });
    
    $(".mytime").timepicki({
        show_meridian: false,
        min_hour_value: 0,
        max_hour_value: 23,
        step_size_minutes: 15,
        overflow_minutes: true,
        increase_direction: 'up'
    });
}

//------------------------------------------------------
//number
//------------------------------------------------------
function addCommaSeperator(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//--------------------------------------------------
//--guid
//--------------------------------------------------
function get_new_guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();    
}

function get_temp_guid(id) {
    var strid = id.toString(16);
    while (strid.length < 12) strid = "0" + strid;

    var g = '00000000-0000-0000-0000-' + strid;

    return g;

}


//--------------------------------------------------
//--dropdown list
//--------------------------------------------------
function addItemsToDroupdown(option) {
    var elementId = option.elementId;
    var data = option.data;
    var addSelectRow = option || false; 
    $("#" + elementId).empty();
    if (addSelectRow)
        $("#" + elementId).append
            ('<option value="null">انتخاب کنید ... </option>');

    $.each(data, function (i, item) {
        $("#" + elementId).append
            ('<option value="' + (item.uniqueId || item.intId)  + '">' + item.title + '</option>');
    });
}
//--------------------------------------------------
//--grid
//--------------------------------------------------
function getSelectedIds(gridId) {
    var selectedids = [];
    var checkboxes = $('#' + gridId + ' .checkboxGrid');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked)
            selectedids.push(checkboxes[i].value);
    }
    return selectedids;
}

function updateMasterCheckbox(gridId) {
    var numchkboxes = $('#' + gridId + ' .checkboxGrid');
    var checked = 0;
    for (var i = 0; i < numchkboxes.length; i++) {
        if (numchkboxes[i].checked)
            checked++;
    }
    $('#mastercheckbox').prop('checked', numchkboxes.length == checked && numchkboxes.length > 0);
}

function mastercheckboxChange(e, gridId) {
    $('#' + gridId + ' .checkboxGrid').prop('checked', e.checked);
};
function getSelectedRow(gridId) {
    var gridData = $("#"+gridId).data("kendoGrid");
    var selectedRowData = gridData.dataItem(gridData.select());
    //var selectedRowData = gridData.dataItem($("#" + gridId).find("tr.k-state-selected"));
    return selectedRowData;
}

//-------------------------------------------------
// question
//-------------------------------------------------


function dialogcallback(callback) {
    $("#dlg_question").modal("hide");
    $("#dlg_question").remove();
    if (callback != null)
        callback();
};
function showQuestion(message, title, yescallback, nocallback) {

    var dialog =
        '<div id="dlg_question" class="modal fade" role="dialog" >' +
            '<div class="modal-dialog" style="width:400px">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '<h4 class="modal-title">' + title + '</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<h6>' + message + '</h6>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button id="btn_yes" class="btn btn-primary large-btn">بله</button>' +
            '<button id="btn_no" class="btn btn-primary large-btn">خیر</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('<div></div>').appendTo('body').html(dialog);
        $("#btn_yes").on("click", function () {
            $("#dlg_question").modal("hide");
            $("#dlg_question").remove();
            if (yescallback != null)
                yescallback();
        });
        $("#btn_no").on("click", function () {
            $("#dlg_question").modal("hide");
            $("#dlg_question").remove();
            if (nocallback != null)
                nocallback();
        });

        $("#dlg_question").modal("show");
    }