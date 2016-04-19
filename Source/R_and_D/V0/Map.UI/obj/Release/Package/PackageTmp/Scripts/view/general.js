
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
function addItemsToDroupdown(elementId, data) {
    $.each(data, function (i, item) {
        $("#" + elementId).append
            ('<option value="' + item.Id + '">' + item.Title + '</option>');
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
    var selectedRowData = gridData.dataItem($("#" + gridId).find("tr.k-state-selected"));
    return selectedRowData;
}