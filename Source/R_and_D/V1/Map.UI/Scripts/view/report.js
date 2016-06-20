
function removeCacheData(clientid) {
    accountManagerApp.callApi(urls.removeproductreportcache, 'POST',
    {
        ClientId: clientid
    },

    function (data) {
    }, false);
}
/*
function loadDdlSaleOffice() {

    $("#ddl_sale_office").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadSaleOffice }
        }
    });
}

function loadSaleOffice(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST',
         { TblName: "gnr.tblSaleOffice", ValueName: "ID", TextName: "Name" },
        function (result) {
            options.success(result);
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
    $('#ddl_seller').kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadAutoSeller }
        }
    });
    
}

function loadAutoSeller(options) {
    accountManagerApp.callApi(urls.getautocompletedata, 'POST',
            {
                tblName: "gnr.vwDealer",
//                searchTerm: $("#ddl_seller").val(),
                valueName: "PersCode",
                textName: "FullName"
            },
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
        dataTextField: 'title',
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
                $("#ddl_good_group").val(dataItem.uniqueId || dataItem.intId);
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
    accountManagerApp.callApi(urls.getautocompletedata, 'POST',        
     {
        SearchValue: $("#auto_good_group").val(),
        TblName: "gnr.tblGoodsGroup", ValueName: "Id",
        TextName: "GoodsGroupName", AddEmptyRow: true
    },
    function (result) {
        options.success(result);
    });

}


function loadDdlGood() {
    $('#auto_good').kendoAutoComplete({
        dataTextField: 'title',
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
                $("#ddl_good").val(dataItem.uniqueId || dataItem.intId);
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
    accountManagerApp.callApi(urls.getautocompletedata, 'POST',        
        {
            SearchValue: $("#auto_good").val(),
            TblName: "gnr.tblGoods",
            ValueName: "GoodsCode",
            TextName: "GoodsName ",
            AddEmptyRow: true
        },
        function (result) {
            options.success(result);
    });

}

*/
