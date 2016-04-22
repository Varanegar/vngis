using System;
using System.IO;
using System.Web.Mvc;
using TrackingMap.UI.ServiceCall;

namespace TrackingMap.UI.Controllers
{
    public class AreaController : Controller
    {


        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Area";
            ViewBag.Title = CaptionResource.Route;
            return View();
        }

    }
}