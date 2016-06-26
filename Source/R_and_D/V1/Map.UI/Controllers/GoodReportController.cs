using Anatoli.ViewModels.RequestModel;
using Anatoli.ViewModels.VnGisModels;
using Stimulsoft.Report;
using System;
using System.Collections.Generic;
using System.IO;
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
        //[Route("prntprdrep")]
        [HttpPost]
        public ActionResult PrintProductReport(ProductReportRequestModel data)
        {
            var allData = ServiceCall.CallApi<List<ProductReportForPrintViewModel>>("pruductreport/prntprdrep", data);
            
            TempData["ProductReportStimulData"] = allData;
            return Json(true);
        }
        
        public ActionResult ShowPrintProductReport(string reportFileName)
        {
            TempData["ProductReportFileName"] = reportFileName;
            return View("ProductReportStimulView");
        }
        public ActionResult GetProductReportSnapshot()
        {

            //ProductReport
            var reportname = TempData["ProductReportFileName"].ToString();
            reportname = reportname.Replace("\"", "");
            StiReport report = null;

            if (!System.IO.File.Exists(Server.MapPath("~/Content/reports/" + reportname + ".dll")))
            {
              // load report from file
                report = new StiReport();
                report.Load(Server.MapPath("~/Content/reports/" + reportname + ".mrt"));
                // compile report to assembly
                report.Compile(Server.MapPath("~/Content/reports/" + reportname + ".dll"));
            }
            else  // if assembly exist
            {
                report = StiReport.GetReportFromAssembly(Server.MapPath("~/Content/reports/" + reportname + ".dll"));
            } 
            //report.Load(Server.MapPath("~/Content/reports/" + reportname + ".mrt"));
            var data = (List<ProductReportForPrintViewModel>)TempData["ProductReportStimulData"];

            report.RegBusinessObject("ProductReportForPrintViewModel", data);
            return StiMvcMobileViewer.GetReportSnapshotResult(HttpContext, report);
        }

       /**************************************************************************
        * product value
        *************************************************************************** */

        //Print
        //[Route("prntprdrep")]
        [HttpPost]
        public ActionResult PrintProductValueReport(ProductReportRequestModel data)
        {
            var allData = ServiceCall.CallApi<List<ProductValueReportForPrintViewModel>>("pruductreport/prntprdvalrep", data);

            TempData["ProductValueReportStimulData"] = allData;
            return Json(true);
        }

        public ActionResult ShowPrintProductValueReport(string reportFileName)
        {
            TempData["ProductReportFileName"] = reportFileName;
            return View("ProductValueReportStimulView");
        }

        public ActionResult GetProductValueReportSnapshot()
        {

            //ProductReport
            var reportname = TempData["ProductValueReportFileName"].ToString();
            reportname = reportname.Replace("\"", "");
            StiReport report = null;

            if (!System.IO.File.Exists(Server.MapPath("~/Content/reports/" + reportname + ".dll")))
            {
                // load report from file
                report = new StiReport();
                report.Load(Server.MapPath("~/Content/reports/" + reportname + ".mrt"));
                // compile report to assembly
                report.Compile(Server.MapPath("~/Content/reports/" + reportname + ".dll"));
            }
            else  // if assembly exist
            {
                report = StiReport.GetReportFromAssembly(Server.MapPath("~/Content/reports/" + reportname + ".dll"));
            }
            //report.Load(Server.MapPath("~/Content/reports/" + reportname + ".mrt"));
            var data = (List<ProductReportForPrintViewModel>)TempData["ProductValueReportStimulData"];

            report.RegBusinessObject("ProductValueReportForPrintViewModel", data);
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