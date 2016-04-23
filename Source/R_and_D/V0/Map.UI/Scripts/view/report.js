
function removeCacheData(clientid) {
    $.ajax({
        type: "POST",
        url: url_removecachedata,
        async: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Id: clientid }),

        success: function (data) {
        }
    });
}

function loadDdlSaleOffice() {


    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblSaleOffice", ValueName: "ID", TextName: "Name", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_sale_office", data);
        }
    });

}


function loadDdlHeader() {
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.vwSupervisor", ValueName: "SupervisorCode", TextName: "FullName", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_header", data);
        }
    });

}

function loadDdlSeller() {
    $('#auto_seller').kendoAutoComplete({
        dataTextField: 'Title',
        filter: 'contains',
        placeholder: 'انتخاب کنید...',
        minLength: 3,
        dataSource: {
            serverFiltering: true,
            //serverPaging: true,
            transport: { read: loadAutoSeller }
        },
        select: function (e) {

            var dataItem = this.dataItem(e.item.index());

            if ((dataItem != null) && (dataItem != undefined)) {
                $("#ddl_seller").val(dataItem.Id || dataItem.IntId);
            } else
                $("#ddl_seller").val('');

            // Use the selected item or its text
        },
        change: function(e) {
            if ($("#auto_seller").data("kendoAutoComplete").value() == "") {
                $("#ddl_seller").val('');
            } 
        }
    });
}

function loadAutoSeller(options) {
    $.ajax({
        type: "POST",
        url: url_getautocompletedata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.vwDealer", 
            SearchValue: $("#auto_seller").val(),
            ValueName: "PersCode",
            TextName: "FullName", AddEmptyRow: true }),
        success: function (result) {
            options.success(result);
        }
    });

}

function loadDdlCustomer() {
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "sle.tblCustCtgrSle", ValueName: "CustCtgrCode", TextName: "CustCtgrName", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_customer_class", data);
        }
    });

}
function loadDdlCustomerActivity() {
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblCustAct", ValueName: "CustActCode", TextName: "CustActName", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_customer_activity", data);
        }
    });

}
function loadDdlCustomerDegree() {
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblCustlevel", ValueName: "Code", TextName: "Title ", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_customer_degree", data);
        }
    });

}
function loadDdlGoodGroup() {
    $('#auto_good_group').kendoAutoComplete({
        dataTextField: 'Title',
        filter: 'contains',
        placeholder: 'انتخاب کنید...',
        minLength: 3,
        dataSource: {
            serverFiltering: true,
            //serverPaging: true,
            transport: { read: loadAutoGoodGroup }
        },
        select: function (e) {

            var dataItem = this.dataItem(e.item.index());

            if ((dataItem != null) && (dataItem != undefined)) {
                $("#ddl_good_group").val(dataItem.Id || dataItem.IntId);
            } else
                $("#ddl_good_group").val('');

            // Use the selected item or its text
        },
        change: function(e) {
            if ($("#auto_good_group").data("kendoAutoComplete").value() == "") {
            $("#ddl_good_group").val('');
        } 
    }
});
}

function loadAutoGoodGroup(options) {
    $.ajax({
        type: "POST",
        url: url_getautocompletedata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            SearchValue: $("#auto_good_group").val(),
            TblName: "gnr.tblGoodsGroup", ValueName: "Id",
            TextName: "GoodsGroupName", AddEmptyRow: true
        }),
        success: function (result) {
            options.success(result);
        }
    });

}

function loadDdlDunamicGroup() {
    //$.ajax({
    //    type: "POST",
    //    url: url_getcombodata,
    //    dataType: "json",
    //    contentType: "application/json; charset=utf-8",
    //    data: JSON.stringify({ TblName: "gnr.tblGoods", ValueName: "Id", TextName: "Name", AddEmptyRow: true }),
    //    success: function (data) {
    //        addItemsToDroupdown("ddl_dynamic_group", data);
    //    }
    //});

}


function loadDdlGood() {
    $('#auto_good').kendoAutoComplete({
        dataTextField: 'Title',
        filter: 'contains',
        placeholder: 'انتخاب کنید...',
        minLength: 3,
        dataSource: {
            serverFiltering: true,
            //serverPaging: true,
            transport: { read: loadAutoGood }
        },
        select: function (e) {

            var dataItem = this.dataItem(e.item.index());

            if ((dataItem != null) && (dataItem != undefined)) {
                $("#ddl_good").val(dataItem.Id || dataItem.IntId);
            } else
                $("#ddl_good").val('');

            // Use the selected item or its text
        },
        change: function (e) {
        if ($("#auto_good").data("kendoAutoComplete").value() == "") {
            $("#ddl_good").val('');
        } 
    }

    });
}

function loadAutoGood(options) {
    $.ajax({
        type: "POST",
        url: url_getautocompletedata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            SearchValue: $("#auto_good").val(),
            TblName: "gnr.tblGoods",
            ValueName: "GoodsCode",
            TextName: "GoodsName ",
            AddEmptyRow: true
        }),
        success: function (result) {
            options.success(result);
        }
    });

}


