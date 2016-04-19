function loadDdlSaleOffice() {
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblSaleOffice", ValueName: "Id", TextName: "Name", AddEmptyRow: true }),
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
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.vwDealer", ValueName: "PersCode", TextName: "FullName", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_seller", data);
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
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblGoodsGroup", ValueName: "Id", TextName: "GoodsGroupName", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_good_group", data);
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
    $.ajax({
        type: "POST",
        url: url_getcombodata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ TblName: "gnr.tblGoods", ValueName: "GoodsCode", TextName: "GoodsName ", AddEmptyRow: true }),
        success: function (data) {
            addItemsToDroupdown("ddl_good", data);
        }
    });

}


