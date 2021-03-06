﻿url_server = "http://localhost:8398/api/";
//url_server = "http://192.168.201.149:2020/api/";
//url_server = "http://217.218.53.71:2020/api/";


url_getcombodata = url_server + "Vn/GetComboData";
url_getautocompletedata = url_server + "Vn/GetAutoCompleteData";
//--------------------------------------------------------
// area
//--------------------------------------------------------
url_loadarealist = url_server + "Area/LoadAreaList";

url_loadareapoints = url_server + "Area/LoadAreaPoints";
url_loadareaparentpoints = url_server + "Area/LoadAreaParentPoints";
url_loadareasibilingpoints = url_server + "Area/LoadAreaSibilingPoints";
url_loadareachildgpoints = url_server + "Area/LoadAreaChildPoints";
url_loadareacustomerpoints = url_server + "Area/LoadAreaCustomerPoints";
url_loadarealeafcustomerpoints = url_server + "Area/LoadAreaLeafCustomerPoints";
url_loadareasline = url_server + "Area/LoadAreasLine";


url_savepoints = url_server + "Area/SaveAreaPoint";
url_removepoint = url_server + "Area/RemoveAreaPoint";
url_removepointsbyareaid = url_server + "Area/RemoveAreaPointsByAreaId"

url_haspoint = url_server + "Area/HasAreaPoint";

url_getareapath = url_server + "Area/GetAreaPath";

url_loadnotselectedcustomer = url_server + "Area/LoadNotSelectedCustomer";
url_loadselectedcustomer = url_server + "Area/LoadSelectedCustomer";
url_addcustomertoselected = url_server + "Area/AddCustomerToSelected";
url_removecustomerfromselected = url_server + "Area/RemoveCustomerFromSelected";

url_savecustomerposition = url_server + "Area/SaveCustomerPosition";

url_vnloadCustomer = url_server + "Vn/LoadCustomer";

//--------------------------------------------------------
// visitor
//--------------------------------------------------------
url_loadvisitorbygroupid = url_server + "Visitor/LoadVisitorByGroupId";
url_loadvisitorgroupbyareaid = url_server + "Visitor/LoadVisitorGroupByAreaId";
url_loadlevel1area = url_server + "Visitor/LoadLevel1Area";

url_loadvisitorspath = url_server + "Visitor/LoadVisitorsPath";
url_loadmarkers = url_server + "Visitor/LoadMarkers";

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
url_loadgoodreport = url_server + "GoodReport/Load";
url_removecachedata = url_server + "GoodReport/RemoveCacheData";
url_loadgoodbyreportcustomer = url_server + "GoodReport/LoadCustomer";

//--------------------------------------------------------
// good by value Report
//--------------------------------------------------------
url_loadgoodbyvaluereport = url_server + "GoodByValueReport/Load";
