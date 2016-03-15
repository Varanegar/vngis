var App = function () {

    var isMainPage = false;
    var isMapPage = false;
    var isIE8 = false;

    var handleMainMenu = function () {
        jQuery('#sidebar .has-sub > a').click(function () {
            var last = jQuery('.has-sub.open', $('#sidebar'));
            last.removeClass("open");
            jQuery('.arrow', last).removeClass("open");
            jQuery('.sub', last).slideUp(200);
            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("open");
                sub.slideUp(200);
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(200);
            }
        });
    }

    var handleTooltip = function () {
        jQuery('.tooltips').tooltip();
    }

    var handlePopover = function () {
        jQuery('.popovers').popover();
    }

    var handleChoosenSelect = function () {
        if (!jQuery().chosen) {
            return;
        }
        $(".chosen").chosen();
        $(".chosen-with-diselect").chosen({
            allow_single_deselect: true
        });
    }

    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }

        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5();
        }
    }

    var handleToggleButtons = function () {
        if (!jQuery().toggleButtons) {
            return;
        }
        $('.basic-toggle-button').toggleButtons();
        $('.text-toggle-button').toggleButtons({
            width: 200,
            label: {
                enabled: "Lorem Ipsum",
                disabled: "Dolor Sit"
            }
        });
        $('.danger-toggle-button').toggleButtons({
            style: {
                // Accepted values ["primary", "danger", "info", "success", "warning"] or nothing
                enabled: "danger",
                disabled: "info"
            }
        });
        $('.info-toggle-button').toggleButtons({
            style: {
                enabled: "info",
                disabled: ""
            }
        });
        $('.success-toggle-button').toggleButtons({
            style: {
                enabled: "success",
                disabled: "danger"
            }
        });
        $('.warning-toggle-button').toggleButtons({
            style: {
                enabled: "warning",
                disabled: "success"
            }
        });

        $('.height-toggle-button').toggleButtons({
            height: 100,
            font: {
                'line-height': '100px',
                'font-size': '20px',
                'font-style': 'italic'
            }
        });

        $('.not-animated-toggle-button').toggleButtons({
            animated: false
        });

        $('.transition-value-toggle-button').toggleButtons({
            transitionspeed: 1 // default value: 0.05
        });

    }

    var handleGoTop = function () {
        /* set variables locally for increased performance */
        jQuery('#footer .go-top').click(function () {
            App.scrollTo();
        });

    }

    // this is optional to use if you want animated show/hide. But plot charts can make the animation slow.
    var handleSidebarTogglerAnimated = function () {

        $('.sidebar-toggler').click(function () {
            if ($('#sidebar > ul').is(":visible") === true) {
                $('#main-content').animate({
                    'margin-right': '25px'
                });

                $('#sidebar').animate({
                    'margin-right': '-190px'
                }, {
                    complete: function () {
                        $('#sidebar > ul').hide();
                        $("#container").addClass("sidebar-closed");
                    }
                });
            } else {
                $('#main-content').animate({
                    'margin-right': '215px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').animate({
                    'margin-right': '0'
                }, {
                    complete: function () {
                        $("#container").removeClass("sidebar-closed");
                    }
                });
            }
        })
    }

    // by default used simple show/hide without animation due to the issue with handleSidebarTogglerAnimated.
    var handleSidebarToggler = function () {

        $('.sidebar-toggler').click(function () {
            if ($('#sidebar > ul').is(":visible") === true) {
                $('#main-content').css({
                    'margin-right': '25px'
                });
                $('#sidebar').css({
                    'margin-right': '-190px'
                });
                $('#sidebar > ul').hide();
                $("#container").addClass("sidebar-closed");
            } else {
                $('#main-content').css({
                    'margin-right': '215px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-right': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }
        })
    }

    return {

        //main function to initiate template pages
        init: function () {

            //if (jQuery.browser.msie && jQuery.browser.version.substr(0, 1) == 8) {
            //    isIE8 = true; // checkes for IE8 browser version
            //    $('.visible-ie8').show();
            //}

            handleMainMenu(); // handles main menu
            handleSidebarToggler();

        },


        // set main page
        setMainPage: function (flag) {
            isMainPage = flag;
        },

        // set map page
        setMapPage: function (flag) {
            isMapPage = flag;
        }

    };

    //input mask

    $('.inputmask').inputmask();

}();

//tooltips

$('.element').tooltip();






