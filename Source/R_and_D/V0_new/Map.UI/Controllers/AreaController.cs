using System;
using System.IO;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class AreaController : Controller
    {


        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Area";
            return View();
        }
    }
}