
url_server = "http://localhost:59822/";
url_prefix = "api/dsd/";



urls = {
    loginUrl: url_server  + '/oauth/token',

    //--------------------------------------------------------
    // area
    //--------------------------------------------------------
    loadarealist: url_server + url_prefix + "route/ldarealst", //"Area/LoadAreaList";    
    loadareapoints: url_server + url_prefix + "route/ldareapoint", //"Area/LoadAreaPoints";
    haspoint: url_server + url_prefix + "route/hsareapoint",    
    getareapath: url_server + url_prefix + "route/getareapath",
    savepoints: url_server + url_prefix + "route/svareapnt",
    loadareaparentpoints: url_server + url_prefix + "route/ldareaprntpnt",
    loadareasibilingpoints: url_server + url_prefix + "route/ldareasblpnt",
    loadareachildgpoints: url_server + url_prefix + "route/ldareachldpnt",
    removepointsbyareaid: url_server + url_prefix + "rout/rmvareapntareaid",
    url_loadlevel1area: url_server + "rout/ldareabylv",

    loadselectedcustomer: url_server + url_prefix + "route/ldselectedcust",
    loadnotselectedcustomer: url_server + url_prefix + "route/ldntselectedcust",
    addcustomertoarea: url_server + url_prefix + "route/adcusttoarea",
    removecustomerfromarea: url_server + url_prefix + "route/rmvcustfrmarea",
    changecustomerposition: url_server + url_prefix + "route/chgcustpos",
    
    vnloadCustomer: url_server + url_prefix + "customer/ldsrch",

    loadvisitorgroupbyareaid: url_server + url_prefix + "personnel/ldgrpbyarea",
    loadpersonelbygroupid: url_server + url_prefix + "personnel/ldperbygrp",

    loadpersonelpath: url_server + url_prefix + "personnel/ldprspth",
    loadpersonelprogrampath: url_server + url_prefix + "personnel/ldprsprgpth",
    loadpersonelactivity: url_server + url_prefix + "personnel/ldprsacts",

    loadgoodreport: url_server + url_prefix + "pruductreport/ldrep"
};

//---------------------------------------------------------------------------------------------------

//--------------------------------------------------------
// area
//--------------------------------------------------------
url_loadarealist = url_server + "Area/LoadAreaList";
url_loadareapoints = url_server + "Area/LoadAreaPoints";
url_getareapath = url_server + "Area/GetAreaPath";

url_haspoint = url_server + "Area/HasAreaPoint";
url_savepoints = url_server + "Area/SaveAreaPoint";
url_loadareaparentpoints = url_server + "Area/LoadAreaParentPoints";
url_loadareasibilingpoints = url_server + "Area/LoadAreaSibilingPoints";
url_loadareachildgpoints = url_server + "Area/LoadAreaChildPoints";
url_removepointsbyareaid = url_server + "Area/RemoveAreaPointsByAreaId";

url_loadselectedcustomer = url_server + "Area/LoadSelectedCustomer";
url_loadnotselectedcustomer = url_server + "Area/LoadNotSelectedCustomer";
url_addcustomertoselected = url_server + "Area/AddCustomerToSelected";
url_removecustomerfromselected = url_server + "Area/RemoveCustomerFromSelected";
url_savecustomerposition = url_server + "Area/SaveCustomerPosition";
url_vnloadCustomer = url_server + "Vn/LoadCustomer";

//--------------------------------------------------------
// visitor
//--------------------------------------------------------
url_loadlevel1area = url_server + "Visitor/LoadLevel1Area";
url_loadvisitorgroupbyareaid = url_server + "Visitor/LoadVisitorGroupByAreaId";
url_loadvisitorbygroupid = url_server + "Visitor/LoadVisitorByGroupId";
url_loadvisitorspath = url_server + "Visitor/LoadVisitorsPath";
url_loadmarkers = url_server + "Visitor/LoadMarkers";

//--------------------------------------------------------
// good Report
//--------------------------------------------------------
url_loadgoodreport = url_server + "GoodReport/Load";

//---------------------------------------------------------------------------------------------------




url_getcombodata = url_server + "Vn/GetComboData";
url_getautocompletedata = url_server + "Vn/GetAutoCompleteData";
//--------------------------------------------------------
// area
//--------------------------------------------------------
url_loadareacustomerpoints = url_server + "Area/LoadAreaCustomerPoints";
url_loadarealeafcustomerpoints = url_server + "Area/LoadAreaLeafCustomerPoints";
url_loadareasline = url_server + "Area/LoadAreasLine";

//url_removepoint = url_server + "Area/RemoveAreaPoint";

//--------------------------------------------------------
// laststatus
//--------------------------------------------------------
url_loadlaststatusmarkers = url_server + "LastStatus/LoadMarkers";

//--------------------------------------------------------
// customer Report
//--------------------------------------------------------
url_loadcustomerreport = url_server + "CustomerReport/Load";

//--------------------------------------------------------
// good Report
//--------------------------------------------------------
url_removecachedata = url_server + "GoodReport/RemoveCacheData";
url_loadgoodbyreportcustomer = url_server + "GoodReport/LoadCustomer";

//--------------------------------------------------------
// good by value Report
//--------------------------------------------------------
url_loadgoodbyvaluereport = url_server + "GoodByValueReport/Load";
