using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrackingMap.Models;
using TrackingMap.Service.BL;

namespace TrackingMap.Controllers
{
    public class RoadController : Controller
    {


        private readonly RoadService _roadService;
        private readonly DistributService _distributService;
        public RoadController(RoadService roadService,
                              DistributService distributService
            )
        {
            _roadService = roadService;
            _distributService = distributService;
        }
        // GET: Road
        public ActionResult Index()
        {
            var model = new RoadModel();
            model = PrepareModel();
            return View(model);
        }


        public ActionResult GetRoadList(int id)
        {
            var model = new AreaModel();
            var area = new List<SelectListItem>();
            var AreaList = _distributService.LoadRood();
            area.AddRange((from d in AreaList select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableAreasGroup = area;
            return Json(area, JsonRequestBehavior.AllowGet);
        }

        public RoadModel PrepareModel()
        {
            var model = new RoadModel();
            var group = new List<SelectListItem>();
            var groupList = _distributService.LoadAreaGroup();
            group.AddRange((from d in groupList select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableRoads = group;

            return model;
        }



        public ActionResult GooglemapRoadView(int id)
        {
            var points = _roadService.LoadRoadPointById(id);
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


            return this.PartialView("../Basic/_GooglemapTrackerPartialView", model);
        }


    }
}