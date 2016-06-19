using Stimulsoft.Report;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Stimulsoft.Report.MvcMobile;

namespace TrackingMap.UI.Controllers
{
    public class GoodReportController : Controller
    {
        // GET: GoodReport
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "GoodReport";
            ViewBag.Title = CaptionResource.GoodReport;
            return View();
        }


        //Print
        public ActionResult ProductReport()
        {
            return View("ProductReportStimulView");
        }
        public ActionResult GetProductReportSnapshot()
        {
            var report = new StiReport();
            report.LoadDocument(Server.MapPath("~/Content/reports/ProductReport.mrt"));
            //report.RegBusinessObject("ProductReport", data);
            return StiMvcMobileViewer.GetReportSnapshotResult(HttpContext, report);
        }
        public ActionResult ViewerEvent()
        {
            return StiMvcMobileViewer.ViewerEventResult(HttpContext);
        }

        public ActionResult PrintReport()
        {
            return StiMvcMobileViewer.PrintReportResult(HttpContext);
        }

        public FileResult ExportReport()
        {
            return StiMvcMobileViewer.ExportReportResult(HttpContext);
        }


    }
}