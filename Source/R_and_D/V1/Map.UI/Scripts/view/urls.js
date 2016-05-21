
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
    removepoints: url_server + url_prefix + "route/rmvareapnt",
    loadlareabyevel: url_server + url_prefix + "route/ldareabylv",
    loadareasline: url_server + url_prefix + "route/ldarealines",

    loadselectedcustomer: url_server + url_prefix + "route/ldselectedcust",
    loadnotselectedcustomer: url_server + url_prefix + "route/ldntselectedcust",
    addcustomertoarea: url_server + url_prefix + "route/adcusttoarea",
    removecustomerfromarea: url_server + url_prefix + "route/rmvcustfrmarea",
    changecustomerposition: url_server + url_prefix + "route/chgcustpos",
    loadroutecustomerpoints: url_server + url_prefix + "route/ldrutcustpnt",
    loadareacustomerpoints: url_server + url_prefix + "route/ldareacustpnt",
    
    autocompleteustomer: url_server + url_prefix + "customer/ldsrch",

    //--------------------------------------------------------
    // visitor
    //--------------------------------------------------------
    loadvisitorgroupbyareaid: url_server + url_prefix + "personnel/ldgrpbyarea",
    loadpersonelbygroupid: url_server + url_prefix + "personnel/ldperbygrp",

    loadpersonelpath: url_server + url_prefix + "tracking/ldprspth",
    loadpersonelprogrampath: url_server + url_prefix + "tracking/ldprsprgpth",
    loadpersonelactivity: url_server + url_prefix + "tracking/ldprsacts",

    //--------------------------------------------------------
    // laststatus
    //--------------------------------------------------------
    loadlaststatusmarkers: url_server + url_prefix + "tracking/ldlstpnt",

    //--------------------------------------------------------
    // product Report
    //--------------------------------------------------------
    loadproductreport: url_server + url_prefix + "pruductreport/ldprdrep",
    loadproductreportcustomer : url_server + url_prefix + "pruductreport/ldcust",
    removeproductreportcache : url_server + url_prefix + "pruductreport/rmvcch",

    loadproductvaluereport: url_server + url_prefix + "pruductreport/ldprdvalrep",

    getcombodata: url_server + url_prefix + "report/ldcmblst",
    getautocompletedata: url_server + url_prefix + "report/ldatcmplst"
};
//--------------------------------------------------------
// customer Report
//--------------------------------------------------------
url_loadcustomerreport = url_server + "CustomerReport/Load";


