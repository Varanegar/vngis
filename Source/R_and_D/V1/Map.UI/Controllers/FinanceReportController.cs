using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
    }
}