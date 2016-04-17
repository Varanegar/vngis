
//--------------------------------------------------
//--guid
//--------------------------------------------------
function get_new_guid() {
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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
    $.each(data, function (i, ItemDropdown) {
        $("#" + elementId).append
            ('<option value="' + ItemDropdown.Id + '">' + ItemDropdown.Title + '</option>');
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