using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class GoodByValueReportController : Controller
    {
        // GET: GoodByValueReport
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "GoodReport2";
            ViewBag.Title = CaptionResource.GoodReport2;
            return View();
        }
    }
}