
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web.Mvc;
using TrackingMap.Models;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Controllers
{
    public class VisitorController : Controller
    {
        private readonly VisitorService _visitorService;
        private readonly TransactionService _transactionService;
        public VisitorController(VisitorService visitorService,
            TransactionService transactionService)
        {
            _visitorService = visitorService;
            _transactionService = transactionService;
        }

        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Visitor";
            var model = PrepareConditionModel();
            return View(model);
        }

        public VisitorConditionModel PrepareConditionModel()
        {
            var model = new VisitorConditionModel();
            var list = _visitorService.LoadVisitorGroup().Select(x => new SelectListItem(){Value = x.Id.ToString(), Text = x.Title}).ToList();
            list.Insert(0,new SelectListItem(){Value = "0", Text = "انتخاب کنید ..."});
            model.AvailableVisitorGroup = list;
            return model;
        }

        public ActionResult LoadVisitorByGroupId(int groupId)
        {
            var list = groupId == 0 ? new List<TextValueView>() : _visitorService.LoadVisitorByGroupId(groupId);
            return Json(list);
        }

        public ActionResult GooglemapVisitorView(VisitorConditionModel filter)
        {
            var model = new VisitorModel();
            
            var line = new List<PointView>();
            var lines = new List<PolyView>();

            var marker = new List<PointView>();
            var markers = new List<PointView>();

            if (filter.VisitorPath)
            {
                var points = _visitorService.LoadVisitorPath(filter.Date, filter.VisitorIds);
                var group = 0;

                Random randonGen = new Random();
                foreach (var pointView in points)
                {
                    if (group == 0)
                        group = pointView.MasterId;

                    if (group != pointView.MasterId)
                    {
                        lines.Add(new PolyView()
                        {
                            Points = line,
                            Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                        });
                        line = new List<PointView>();
                        group = pointView.MasterId;
                    }
                    line.Add(pointView);
                }
                if (line.Count > 0)
                    lines.Add(new PolyView()
                    {
                        Points = line,
                        Color = Color.FromArgb(randonGen.Next(200), randonGen.Next(200), randonGen.Next(200))
                    });
                model.Lines = lines;
            }

            if (filter.DailyPath)
            {
                line = new List<PointView>();
                var points = _visitorService.LoadDailyPath(filter.Date, filter.VisitorIds);
                var group = 0;

                foreach (var pointView in points)
                {
                    if (group == 0)
                        group = pointView.MasterId;

                    if (group != pointView.MasterId)
                    {
                        lines.Add(new PolyView()
                        {
                            Points = line,
                            Color = Color.Black
                        });
                        line = new List<PointView>();
                        group = pointView.MasterId;
                    }
                    line.Add(pointView);
                }
                if (line.Count > 0)
                    lines.Add(new PolyView()
                    {
                        Points = line,
                        Color = Color.Black
                    });
                model.Lines = lines;

            }

            if (filter.Order)
            {
                marker = _transactionService.LoadTransactionList(filter.VisitorIds);
                model.MarkerPoints = marker;
            }
            return this.PartialView("_GooglemapVisitorPartialView", model);
        }
    }
}
