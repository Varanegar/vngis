
function removeCacheData(clientid) {
    accountManagerApp.callApi(urls.removeproductreportcache, 'POST',
    {
        ClientId: clientid
    },

    function (data) {
    }, false);
}

function loadDdlSaleOffice() {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
         { TblName: "gnr.tblSaleOffice", ValueName: "ID", TextName: "Name" },
         function (data) {
             addItemsToDroupdown({ elementId: "ddl_sale_office", data: data, addSelectRow: true });
    });

}


function loadDdlHeader() {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.vwSupervisor", ValueName: "SupervisorCode", TextName: "FullName", AddEmptyRow: true },
        function (data) {
            addItemsToDroupdown({ elementId: "ddl_header", data: data, addSelectRow: true });
    });

}

function loadDdlSeller() {
    $('#auto_seller').kendoAutoComplete({
        dataTextField: 'title',
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
                $("#ddl_seller").val(dataItem.uniqueId || dataItem.intId);
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
    accountManagerApp.callApi(urls.getautocompletedata, 'POST', 
            { tblName: "gnr.vwDealer", 
            searchTerm: $("#auto_seller").val(),
            valueName: "PersCode",
            textName: "FullName" },
        function (result) {
            options.success(result);
    });

}

function loadDdlCustomer() {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "sle.tblCustCtgrSle", ValueName: "CustCtgrCode", TextName: "CustCtgrName", AddEmptyRow: true },
        function (data) {
            addItemsToDroupdown({ elementId: "ddl_customer_class", data: data, addSelectRow: true });
    });

}
function loadDdlCustomerActivity() {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustAct", ValueName: "CustActCode", TextName: "CustActName"},
        function (data) {
            addItemsToDroupdown({ elementId: "ddl_customer_activity", data: data, addSelectRow: true });
    });
}
function loadDdlCustomerDegree() {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustlevel", ValueName: "Code", TextName: "Title ", AddEmptyRow: true },
        function (data) {
            addItemsToDroupdown({ elementId: "ddl_customer_degree", data: data, addSelectRow: true });
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


