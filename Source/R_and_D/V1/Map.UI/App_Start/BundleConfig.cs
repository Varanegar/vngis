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
                        "~/Scripts/jquery/jquery-{version}.js",
                        "~/Scripts/jquery/jquery.cookie.js",
                        "~/Scripts/jquery/jquery.blockUI.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                     "~/Scripts/knockout/knockout-3.4.0.js",
                     "~/Scripts/knockout/knockout.mapping-latest.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/toastr.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/map").Include(
                      "~/Scripts/map/markerclusterer.js",
                      "~/Scripts/map/markerwithlabel.js",
                      "~/Scripts/map/vn.googlemap.js",
                      "~/Scripts/map/mapgeneral.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                      "~/Scripts/kendo/kendo.all.min.js",
                      "~/Scripts/kendo/kendo.messages.fa-IR.js"));

              bundles.Add(new StyleBundle("~/Content/kendocss").Include(
                        "~/Content/css/kendo/kendo.common-material.min.css",
                        "~/Content/css/kendo/kendo.rtl.min.css",
                        "~/Content/css/kendo/kendo.material.min.css"
                      ));

              bundles.Add(new StyleBundle("~/Content/sitecss").Include(
                  "~/Content/css/bootstrap-rtl.css",
                  "~/Content/css/Site.css",
                  "~/Content/css/toastr.min.css",
                  "~/Content/css/map.css",
                  "~/Content/css/style_responsive.css",
                  "~/Content/css/sb-admin-2.css"
                      ));         
        }
    }
}
