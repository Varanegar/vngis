
using System;
using System.IO;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class VisitorController : Controller
    {

        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Visitor";
            //var model = PrepareConditionModel();
            return View();
        }

//        public VisitorConditionModel PrepareConditionModel()
//        {
//            var model = new VisitorConditionModel();
////            var list = _areaService.LoadArea1().Select(x => new SelectListItem(){Value = x.Id.ToString(), Text = x.Title}).ToList();
////            list.Insert(0,new SelectListItem(){Value = null, Text = "همه"});
////            model.AvailableArea = list;
//            return model;
//        }

    }
}
