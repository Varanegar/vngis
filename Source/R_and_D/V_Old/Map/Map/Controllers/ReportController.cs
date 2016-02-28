using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrackingMap.Models;
using TrackingMap.Service.BL;
using TrackingMap.Service.Filter;

namespace TrackingMap.Controllers
{
    public class ReportController : Controller
    {
       
        private readonly CustomerService _customerService;
        private readonly VisitorService _visitorService;
        private readonly ReportService _reportService;
        private readonly DistributService _distributService;
        private readonly GoodService _goodService;
        private readonly AreaService _areaService;
        private readonly TrackerService _trackerService;

        public ReportController(
                    CustomerService customerService,
                    VisitorService visitorService,
                    ReportService reportService,
                    DistributService distributService,
                    GoodService goodService,
                    AreaService areaService,
                    TrackerService trackerService
            )
        {
            _reportService = reportService;
            _customerService = customerService;
            _visitorService = visitorService;
            _goodService = goodService;
            _distributService = distributService;
            _areaService = areaService;
            _trackerService = trackerService;
        }
        
        //
        // GET: /Report/
        public ActionResult Index()
        {
            ViewBag.Title = CaptionResource.AppName;
            ViewBag.CurrMenu = "Report";
            var model = new ReportModel();
            model = PrepareCondition();
            return View(model);
        }

        public ReportModel PrepareCondition()
        {
            var model = new ReportModel();

            var cus = new List<SelectListItem>();
            cus.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var customers = _customerService.LoadCustomerGroup();
            cus.AddRange((from d in customers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableCustomerGroup = cus;

            var act = new List<SelectListItem>();
            act.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var activities = _customerService.LoadActivity();
            act.AddRange((from d in activities select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableActivity = act;

            var vis = new List<SelectListItem>();
            vis.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var visitors = _visitorService.LoadVisitorGroup();
            vis.AddRange((from d in visitors select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableVisitorGroup = vis;

            var god = new List<SelectListItem>();
            god.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var goods = _goodService.LoadGoodGroup();
            god.AddRange((from d in goods select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableGoodGroup = god;

            var dis = new List<SelectListItem>();
            dis.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var distributers = _distributService.LoadDistributer();
            dis.AddRange((from d in distributers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableDistributer = dis;

            var drv = new List<SelectListItem>();
            drv.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var drivers = _distributService.LoadDriver();
            drv.AddRange((from d in drivers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            model.AvailableDriver = drv;

            //var rod = new List<SelectListItem>();
            //rod.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            //var roads = _distributService.LoadRoadGroup();
            //rod.AddRange((from d in roads select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            //model.AvailableRoadGroup = rod;

            //var area = new List<SelectListItem>();
            //area.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            //var areas = _distributService.LoadAreaGroup();
            //area.AddRange((from d in areas select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            //model.AvailableAreaGroup = area;
            return model;
        }




        [HttpPost]
        public JsonResult FetchCustomerByGroupId(int grpId, string title)
        {
            var cus = new List<SelectListItem>();
            cus.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var customers = _customerService.LoadCustomerByGroupId(grpId, title);
            cus.AddRange((from d in customers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            return Json(cus);
        }

        [HttpPost]
        public JsonResult FetchVisitorByGroupId(int grpId)
        {
            var vis = new List<SelectListItem>();
            vis.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var customers = _visitorService.LoadVisitorByGroupId(grpId);
            vis.AddRange((from d in customers select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            return Json(vis);
        }

        [HttpPost]
        public JsonResult FetchGoodByGroupId(int grpId)
        {
            var good = new List<SelectListItem>();
            good.Add(new SelectListItem() { Value = "0", Text = CaptionResource.Select_Item });
            var goods = _goodService.LoadGoodByGroupId(grpId);
            good.AddRange((from d in goods select new SelectListItem() { Value = d.Id + "", Text = d.Title }).ToList());
            return Json(good);
        }



        public ActionResult GooglemapPartialView(ReportFilter filter)
        {
            var model = new MapModel();
            var line = new List<TrackingMap.Service.ViewModel.PointView>();
            model.Points = _reportService.LoadMapPoint(filter).ToList();
            //-----------------------------------------------------------------
            if (filter.Limited)
            {
                var points = _areaService.LoadAreaPointById(0);
                var group = 0;
                var polygons = new List<PolyModel>();
                Random randonGen = new Random();
                foreach (var pointView in points)
                {
                    if (group == 0)
                        group = pointView.MasterId;

                    if (group != pointView.MasterId)
                    {
                        polygons.Add(new PolyModel()
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
                    polygons.Add(new PolyModel()
                    {
                        Points = line,
                        Color = Color.DarkRed//Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                    });
                model.Polygons = polygons;
            }

            var lines = new List<PolyModel>();
            //-----------------------------------------------------------------
            if (filter.Road)
            {
            }
            //------------------------------------------------------------------
            if (filter.VisitorPath || filter.MachinPath)
            {

                var points = _trackerService.LoadMapTracker(filter).OrderBy(x => x.MasterId);
                var group = 0;
                Random randonGen = new Random();
                foreach (var pointView in points)
                {
                    if (group == 0)
                        group = pointView.MasterId;

                    if (group != pointView.MasterId)
                    {
                        lines.Add(new PolyModel()
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
                    lines.Add(new PolyModel()
                    {
                        Points = line,
                        Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                    });
                model.Lines = lines;
            }
            return this.PartialView("../Basic/_GooglemapPartialView", model);
        }


	}




}