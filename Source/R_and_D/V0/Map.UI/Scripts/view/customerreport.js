$(document).ready(function () {
    $("#div_advance_condition").hide();

    kendo.culture("fa-IR");
    var date = new JalaliDate();
    $("#dte_from").kendoDatePicker({
        format: "yyyy/MM/dd"
    }).val(date.toFullDateString());
    $("#dte_to").kendoDatePicker({
        format: "yyyy/MM/dd"
    }).val(date.toFullDateString());

    initMap('mapContainer', { lng: 51.4230556, lat: 35.6961111 });

    $("#btn_adv_con").on("click", function (e) {
        if ($("#div_advance_condition").is(':hidden')) {
            $("#div_advance_condition").show(500);
            $("#btn_adv_con").html('خلاصه');
        } else {
            $("#div_advance_condition").hide(500);
            $("#btn_adv_con").html('پیشرفته');
        }
    });

});