using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    //[Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = CaptionResource.AppName;

            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your About page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Error()
        {

            return View();
        }
    }
}
