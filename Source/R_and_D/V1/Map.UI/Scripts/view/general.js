orderEvent = "E780728B-9BAC-4E86-AFE0-9886AD101128",
lackOfVisitEvent = "E68F7931-2189-4000-B173-D02719720923",
lackOfOrderEvent = "E8ED4D92-CBC0-40F1-A732-53CFF4C91AC5",
stopWithoutCustomerEvent = "3",
customerPoint = "5",
gpsOffEvent = 7;


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
//--date and time
//--------------------------------------------------
function intDate(dateId, setToday) {
    var dte = $("#" + dateId).kendoDatePicker({ format: "yyyy/MM/dd" });
    if (setToday) {
        var date = new JalaliDate();
        dte.val(date.toFullDateString());
    }
    return dte;
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
            ('<option value="">انتخاب کنید ... </option>');

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
