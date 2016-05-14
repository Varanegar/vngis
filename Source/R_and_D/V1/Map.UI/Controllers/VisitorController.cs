using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class VisitorController : Controller
    {

        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Tracking";
            ViewBag.Title = CaptionResource.Tracking;
            
            return View();
        }


    }
}
