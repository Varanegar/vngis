using System;
using System.IO;
using System.Web.Mvc;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.UI.ServiceCall;

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