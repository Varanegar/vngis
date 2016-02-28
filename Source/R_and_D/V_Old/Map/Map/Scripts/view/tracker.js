
$(document).ready(function() {
      
    $("#from_Date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });
    $("#to_Date").kendoDatePicker({
        format: "yyyy/MM/dd",
    });

    $("#ddl_visitorgroup").on("change", function (event) {
        var VisitorGroupValues = $("#ddl_visitorgroup").val();
        $("#ddl_visitor").empty();
        $.ajax({
            type: "POST",
            url: "/Order/FetchVisitorByGroupId",
            dataType: "json",
            data: { grpId: VisitorGroupValues },
            success: function (data) {

                $.each(data, function (i, ItemDropdown) {
                    $("#ddl_visitor").append
                        ('<option value="' + ItemDropdown.Value + '">' + ItemDropdown.Text + '</option>');

                });
            }
        })
        .done(function (Result) {
        });
    });


    $("#rd_visitor").on("click", function (e) {
        $("#div_visitor").show();
        $("#div_machin").hide();
    });

    $("#rd_machin").on("click", function (e) {
        $("#div_visitor").hide();
        $("#div_machin").show();
    });

    $("#rd_visitor").prop("checked", true)
    $("#rd_visitor").click();

    $("#btnMap").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("#Report_Map").show();
        new $.jmelosegui.GoogleMap('#mapContainer').ajax({
            url: 'GooglemapTrackerPartialView',
            type: "Get",
            data:  aditionaldata() ,
            success: function (data) {
                //alert('succeded');
            }
        });
    });
    

});

function aditionaldata() {
    var id;
    if ($("#rd_visitor").is(':checked')) {
        id = $("#ddl_visitor").val();
    } else {
        id = $("#ddl_driver").val();
    }

    return {
        Visitor: $("#rd_visitor").is(':checked'),
        Machin: $("#rd_machin").is(':checked'),
        FromDate: $("#from_Date").val(),
        ToDate: $("#to_Date").val(),
        FromTime: '',
        ToTime: '',
        Id: id
    }
}


//$("#Organ-DropDown").change(OrganizationsDropDownVals);
//OrganizationsDropDownVals();
