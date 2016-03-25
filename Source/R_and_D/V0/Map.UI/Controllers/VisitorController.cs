
using System;
using System.IO;
using System.Web.Mvc;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.UI.ServiceCall;

namespace TrackingMap.UI.Controllers
{
    public class VisitorController : Controller
    {

        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Visitor";
            return View();
        }

        //public ActionResult GooglemapVisitorView(VisitorConditionModel filter)
        //{
        //    using (var proxy = new WebProxy())
        //    {
        //        string json = proxy.UploadString(proxy.RegisterRoutes("Visitor/MapVisitorModel"),
        //            JsonTools.ObjectToJson(filter));
        //        var model = JsonTools.JsonToObject<VisitorModel>(json);
        //        return this.PartialView("_GooglemapVisitorPartialView", model);
        //    }

        //}


    }
}
