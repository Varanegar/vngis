using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class LastStatusController : Controller
    {
        // GET: LastStatus
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "LastStatus";
            ViewBag.Title = CaptionResource.LastStatus;

            return View();
        }
    }
}