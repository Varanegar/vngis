using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Jmelosegui.Mvc.GoogleMap;
using Microsoft.Owin.Security.Google;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Models;

namespace TrackingMap.Controllers
{
    public class AreaController : Controller
    {

        private readonly AreaService _areaService;
        private readonly DistributService _distributService;
        public AreaController(AreaService areaService,
            DistributService distributService)
        {
            _areaService = areaService;
            _distributService = distributService;
        }
        
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Area";
            return View();
        }

        public ActionResult GetAreaList1()
        {
            var model = new AreaModel();
            var area = new List<SelectListItem>();
            var AreaList = _distributService.LoadArea1();
            area.AddRange((from d in AreaList select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableAreasGroup = area;
            return Json(area, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveAreaPoint(int id, AreaPointView[] markers)
        {
            _areaService.SaveAreaPointList(id, markers.ToList());
            return Json(new { success = true });
            //Redirect("GooglemapLimiteView", new { id });
        }
        public ActionResult GooglemapAreaView(int id)
        {
            var points = _areaService.LoadAreaPointById(id);
            var group = 0;
            var line = new List<TrackingMap.Service.ViewModel.PointView>();
            var model = new List<PolyModel>();
            Random randonGen = new Random();
            foreach (var pointView in points)
            {
                if (group == 0)
                    group = pointView.MasterId;

                if (group != pointView.MasterId)
                {
                    model.Add(new PolyModel()
                    {
                        Points = line,
                        Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                    });
                    line = new List<TrackingMap.Service.ViewModel.PointView>();
                    group = pointView.MasterId;
                }
                line.Add(pointView);
            }
            if (line.Count > 0)
                model.Add(new PolyModel()
                {
                    Points = line,
                    Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                });


            return this.PartialView("../Basic/_GooglemapAreaPartialView", model);
        }
    }
}