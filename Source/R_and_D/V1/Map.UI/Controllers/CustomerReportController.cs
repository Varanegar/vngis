using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class CustomerReportController : Controller
    {
        // GET: CustomerReport
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "CustomerReport";
            ViewBag.Title = CaptionResource.CustomerReport;

            return View();
        }
    }
}