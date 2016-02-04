using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrackingMap.Service.BL;
using TrackingMap.Service.Filter;
using TrackingMap.Models;

namespace TrackingMap.Controllers
{
    public class TrackerController : Controller
    {

        private readonly VisitorService _visitorService;
        private readonly DistributService _distributService; 
        private readonly TrackerService _trackerService;
        public TrackerController(
            VisitorService visitorService,
            DistributService distributService, 
            TrackerService trackerService
            )
        {
            _visitorService = visitorService;
            _distributService = distributService;
            _trackerService = trackerService;
        }
        
        // GET: Tracker
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Order";
            var tracker = new TrackerConditionModel();
            tracker = PrepareCondition();
            return View(tracker);
        }

        public TrackerConditionModel PrepareCondition()
        {
            var conditionmodel = new TrackerConditionModel();
            var vis = new List<SelectListItem>();
            vis.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var visitors = _visitorService.LoadVisitorGroup();
            vis.AddRange((from d in visitors select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            conditionmodel.AvailableVisitorGroup = vis;

            var drv = new List<SelectListItem>();
            drv.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var drivers = _distributService.LoadDriver();
            drv.AddRange((from d in drivers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            conditionmodel.AvailableDriver = drv;

            return conditionmodel;
        }

        public ActionResult GooglemapTrackerPartialView(ReportFilter filter)
        {
            var points = _trackerService.LoadMapTracker(filter).OrderBy(x => x.MasterId);
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
                    model.Add(new PolyModel() { Points = line, 
                        Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200)) });
                    line = new List<TrackingMap.Service.ViewModel.PointView>();
                    group = pointView.MasterId;
                }
                line.Add(pointView);
            }
            if (line.Count > 0)
                model.Add(new PolyModel() { Points = line,
                                               Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                });

            return this.PartialView("../Basic/_GooglemapTrackerPartialView", model);
        }

    }
}