
//privateOwnerId = '79A0D598-0BD2-45B1-BAAA-0A9CF9EFF240',
//dataOwnerId = 'DD86E785-7171-498E-A9BB-82E1DBE334EE',
//dataOwnerCenterId = '02313882-9767-446D-B4CE-54004EF0AAC4',
//url_server = "http://217.218.53.71:4040/";

privateOwnerId = '79A0D598-0BD2-45B1-BAAA-0A9CF9EFF240',
dataOwnerId = '3EEE33CE-E2FD-4A5D-A71C-103CC5046D0C',
dataOwnerCenterId = '3EEE33CE-E2FD-4A5D-A71C-103CC5046D0C',

url_server = "http://localhost:59822";

url_prefix = "/api/dsd/";

urls = {
    loginUrl: url_server  + '/oauth/token',

    //--------------------------------------------------------
    // area
    //--------------------------------------------------------
    loadarealist: url_server + url_prefix + "route/ldarealst", //"Area/LoadAreaList";    
    loadareapoints: url_server + url_prefix + "route/ldareapoint", //"Area/LoadAreaPoints";
    getareacenterpoint: url_server + url_prefix + "route/gtareacntpnt", 
    haspoint: url_server + url_prefix + "route/hsareapoint",
    getareapath: url_server + url_prefix + "route/getareapath",
    savepoints: url_server + url_prefix + "route/svareapnt",
    loadareaparentpoints: url_server + url_prefix + "route/ldareaprntpnt",
    loadareasibilingpoints: url_server + url_prefix + "route/ldareasblpnt",
    loadareachildgpoints: url_server + url_prefix + "route/ldareachldpnt",
    removepoints: url_server + url_prefix + "route/rmvareapnt",
    loadlareabyevel: url_server + url_prefix + "route/ldareabylv",
    loadareasline: url_server + url_prefix + "route/ldarealines",
    loadCustomersWithouteLocation: url_server + url_prefix + "route/ldcustnoloc",
    loadCustomersInvalidLocation: url_server + url_prefix + "route/ldcustinvloc",
    loadCustomersValidLocation: url_server + url_prefix + "route/ldcustvloc",
    loadCustomersLocationCount: url_server + url_prefix + "route/ldcustloccnt",
    
    

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
    loadproductvaluereport: url_server + url_prefix + "pruductreport/ldprdvalrep",
    loadproductreportcustomer: url_server + url_prefix + "pruductreport/ldcust",
    removeproductreportcache: url_server + url_prefix + "pruductreport/rmvcch",

    printproductreport: "/GoodReport/PrintProductReport",
    printproductvaluereport: "/GoodReport/PrintProductValueReport",

    //--------------------------------------------------------
    // finance Report
    //--------------------------------------------------------
    loadfinancereport: url_server + url_prefix + "financereport/ldfinrep",
    loadfinancevaluereport: url_server + url_prefix + "financereport/ldfinvalrep",
    loadfinancereportcustomer: url_server + url_prefix + "financereport/ldcust",
    removefinancereportcache: url_server + url_prefix + "financereport/rmvcch",

    //--------------------------------------------------------
    // Report
    //--------------------------------------------------------
    loadprintlist: url_server + url_prefix + "report/ldrptlst",
    getcombodata: url_server + url_prefix + "report/ldcmblst",
    getautocompletedata: url_server + url_prefix + "report/ldatcmplst"


};
//--------------------------------------------------------
// customer Report
//--------------------------------------------------------
url_loadcustomerreport = url_server + "CustomerReport/Load";


