
function removeCacheData(clientid) {
    accountManagerApp.callApi(urls.removeproductreportcache, 'POST',
    {
        ClientId: clientid
    },

    function (data) {
    }, false);
}

function loadDdlSaleOffice() {
    $("#ddl_sale_office").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
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
    $("#ddl_header").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadHeader }
        }
    });
}

function loadHeader(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.vwSupervisor", ValueName: "ID", TextName: "FullName", AddEmptyRow: true },
        function (result) {
            options.success(result);
    });

}

function loadDdlSeller() {
    $('#ddl_seller').kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadSeller }
        }
    });
    
}

function loadSeller(options) {
    accountManagerApp.callApi(urls.getautocompletedata, 'POST',
            {
                tblName: "gnr.vwDealer",
//                searchTerm: $("#ddl_seller").val(),
                valueName: "ID",
                textName: "FullName"
            },
        function (result) {
            options.success(result);
        });

}

function loadDdlCustomer() {
    $("#ddl_customer_class").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomer }
        }
    });
}

function loadCustomer(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST',
        { TblName: "sle.tblCustCtgrSle", ValueName: "ID", TextName: "CustCtgrName", AddEmptyRow: true },
        function(result) {
            options.success(result);
        });
}

function loadDdlCustomerActivity() {
    $("#ddl_customer_activity").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomerActivity }
        }
    });
}
function loadCustomerActivity(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustAct", ValueName: "ID", TextName: "CustActName"},
        function(result) {
            options.success(result);
        });
}


/******************************************************/
/* CustomerDegree                                     */
/******************************************************/
function loadDdlCustomerDegree() {
    $("#ddl_customer_degree").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadCustomerDegree }
        }
    });
}

function loadCustomerDegree(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblCustlevel", ValueName: "ID", TextName: "Title ", AddEmptyRow: true },
        function(result) {
            options.success(result);
        });
}

/******************************************************/
/* Good Group                                         */
/******************************************************/
function loadDdlGoodGroup() {
    $("#ddl_good_group").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGoodGroup }
        }
    });
}
function loadDdlUnsoldGoodGroup() {
    $("#ddl_unsold_good_group").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGoodGroup }
        }
    });
}

function loadGoodGroup(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblGoodsGroup", ValueName: "Id", TextName: "GoodsGroupName ", AddEmptyRow: true },
    function (result) {
        options.success(result);
    });

}

/******************************************************/
/* Good                                               */
/******************************************************/
function loadDdlUnsoldGood() {
    $("#ddl_unsold_good").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGood }
        }
    });
}

function loadDdlGood() {
    $("#ddl_good").kendoComboBox({
        placeholder: "انتخاب کنید ..",
        dataTextField: "title",
        dataValueField: "intId",
        filter: "contains",
        autoBind: false,
        change: onComboChange,
        minLength: 3,
        dataSource: {
            serverFiltering: false,
            transport: { read: loadGood }
        }
    });
}

function loadGood(options) {
    accountManagerApp.callApi(urls.getcombodata, 'POST', 
        { TblName: "gnr.tblGoods", ValueName: "ID", TextName: "GoodsName ", AddEmptyRow: true },
    function (result) {
        options.success(result);
    });
}


function onComboChange(e) {
    changed = true;
}

