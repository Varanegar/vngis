using System.Web.Mvc;

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