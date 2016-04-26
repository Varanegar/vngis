using System.Web;
using System.Web.Optimization;

namespace TrackingMap.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/map").Include(
                      "~/Scripts/map/markerclusterer.js",
                      "~/Scripts/map/markerwithlabel.js",
                      "~/Scripts/map/vn.googlemap.js",
                      "~/Scripts/map/mapgeneral.js"));
            
            const string kendoVersion = "2014.1.318";
            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                      string.Format("~/Scripts/kendo/{0}/kendo.web.min.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/fa-IR.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/JalaliDate.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/kendo.core.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/kendo.calendar.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/kendo.popup.js", kendoVersion),
                      string.Format("~/Scripts/kendo/{0}/kendo.datepicker.js", kendoVersion))
                      );
              bundles.Add(new StyleBundle("~/Content/kendocss").Include(
                        string.Format("~/Content/css/kendo/{0}/kendo.default.min.css", kendoVersion),
                        string.Format("~/Content/css/kendo/{0}/kendo.common.min.css", kendoVersion)
                      ));
              bundles.Add(new StyleBundle("~/Content/sitecss").Include(
                  "~/Content/css/bootstrap-rtl.css",
                        "~/Content/css/Site.css",
                        "~/Content/css/map.css",
                        "~/Content/css/style_responsive.css",
                        "~/Content/css/sb-admin-2.css"
                      ));         
        }
    }
}
