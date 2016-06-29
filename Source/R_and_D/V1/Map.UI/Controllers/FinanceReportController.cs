using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Anatoli.ViewModels.RequestModel;
using Anatoli.ViewModels.VnGisModels;
using Stimulsoft.Report;
using Stimulsoft.Report.MvcMobile;

namespace TrackingMap.UI.Controllers
{
    public class FinanceReportController : Controller
    {
        // GET: FinanceReport
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "FinanceReport";
            ViewBag.Title = CaptionResource.FinanceReport;

            return View();
        }

        //Print
        //[Route("prntprdrep")]
        [HttpPost]
        public ActionResult PrintProductReport(FinanceReportRequestModel data)
        {
            var allData = ServiceCall.CallApi<List<FinanceReportForPrintViewModel>>("financereport/prntfinrep", data);

            TempData["FinanceReportStimulData"] = allData;
            return Json(true);
        }

        public ActionResult ShowPrintFinanceReport(string reportFileName)
        {
            TempData["FinanceReportFileName"] = reportFileName;
            return View("FinanceReportStimulView");
        }
        public ActionResult GetFinanceReportSnapshot()
        {

            //ProductReport
            var reportname = TempData["Finance"].ToString();
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
            var data = (List<FinanceReportForPrintViewModel>)TempData["FinanceReportStimulData"];

            report.RegBusinessObject("FinanceReportForPrintViewModel", data);
            return StiMvcMobileViewer.GetReportSnapshotResult(HttpContext, report);
        }

        /**************************************************************************
         * finance value
         *************************************************************************** */

        //Print
        //[Route("prntprdrep")]
        [HttpPost]
        public ActionResult PrintFinanceValueReport(FinanceReportRequestModel data)
        {
            var allData = ServiceCall.CallApi<List<FinanceValueReportForPrintViewModel>>("financereport/prntfinvalrep", data);

            TempData["FinanceValueReportStimulData"] = allData;
            return Json(true);
        }

        public ActionResult ShowPrintFinanceValueReport(string reportFileName)
        {
            TempData["FinanceReportFileName"] = reportFileName;
            return View("FinanceValueReportStimulView");
        }

        public ActionResult GetFinanceValueReportSnapshot()
        {

            //ProductReport
            var reportname = TempData["FinanceValueReportFileName"].ToString();
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

            report.RegBusinessObject("FinanceValueReportForPrintViewModel", data);
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