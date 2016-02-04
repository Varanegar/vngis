using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrackingMap.Service.BL;

namespace TrackingMap.Controllers
{
    public class SettingController : Controller
    {
        private SettingService _settingService;

        public SettingController(SettingService settingService)
        {
            _settingService = settingService;
        }

        public ActionResult Index()
        {
            _settingService.LoadSetting();
            return View();
        }
    }
}