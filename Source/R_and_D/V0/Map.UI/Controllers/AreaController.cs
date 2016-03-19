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


        public ActionResult GooglemapAreaView(AreaConditionModel condition)
        {
            using (var proxy = new WebProxy())
            {
                string json = proxy.UploadString(proxy.RegisterRoutes("Area/MapAreaModel"),
                    JsonTools.ObjectToJson(condition));
                var model = JsonTools.JsonToObject<AreaModel>(json);
                return this.PartialView("_GooglemapAreaPartialView", model);
            }
        }

    }
}