
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web.Mvc;
using TrackingMap.Models;
using TrackingMap.Service.BL;
using TrackingMap.Service.Tools;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Controllers
{
    public class VisitorController : Controller
    {
        private readonly VisitorService _visitorService;
        private readonly AreaService _areaService;
        private readonly TransactionService _transactionService;
        public VisitorController(VisitorService visitorService,
            TransactionService transactionService,
            AreaService areaService
            )
        {
            _visitorService = visitorService;
            _transactionService = transactionService;
            _areaService = areaService;
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
            var list = _areaService.LoadArea1().Select(x => new SelectListItem(){Value = x.Id.ToString(), Text = x.Title}).ToList();
            list.Insert(0,new SelectListItem(){Value = null, Text = "همه"});
            model.AvailableArea = list;
            return model;
        }

        public ActionResult LoadVisitorGroupByAreaId(Guid areaId)
        {
            var list = _visitorService.LoadVisitorGroup(areaId);
            list.Insert(0, new TextValueView() { Id = null, Title = "انتخاب کنید..." });
            return Json(list);
        }

        public ActionResult LoadVisitorByGroupId(Guid groupId)
        {
            var list = groupId == null ? new List<TextValueView>() : _visitorService.LoadVisitorByGroupId(groupId);
            return Json(list);
        }

        public ActionResult GooglemapVisitorView(VisitorConditionModel filter)
        {
            var model = new VisitorModel();
            


            var marker = new List<PointView>();

            if (filter.VisitorPath)
            {
                var points = _visitorService.LoadVisitorPath(filter.Date, filter.VisitorIds);
                model.Lines = GeneralTools.PointListToPolyList(points, false, false);
            }

            if (filter.DailyPath)
            {
                var points = _visitorService.LoadDailyPath(filter.Date, filter.VisitorIds);
                model.Lines.AddRange(GeneralTools.PointListToPolyList(points, false, false));
            }

            marker = _transactionService.LoadTransactionList(filter.VisitorIds,
                            filter.Order,
                            filter.LackOrder,
                            filter.LackVisit,
                            filter.StopWithoutCustomer,
                            filter.StopWithoutActivity);
            model.MarkerPoints = marker;
            
            return this.PartialView("_GooglemapVisitorPartialView", model);
        }
    }
}
