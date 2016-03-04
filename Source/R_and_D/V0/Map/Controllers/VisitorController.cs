
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
                model.Lines = GeneralTools.PointListToPolyList(points);
            }

            if (filter.DailyPath)
            {
                var points = _visitorService.LoadDailyPath(filter.Date, filter.VisitorIds);
                model.Lines.AddRange(GeneralTools.PointListToPolyList(points, true));
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
