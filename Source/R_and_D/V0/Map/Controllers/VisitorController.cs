
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using TrackingMap.Service.BL;
using TrackingMap.Service.Tools;
using TrackingMap.Common.ViewModel;
using System.Web.Http;

namespace TrackingMap.Controllers
{
    public class VisitorController : ApiController
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


        public List<TextValueView> LoadLevel1Area()
        {
            var list = _areaService.LoadArea1().ToList();
            list.Insert(0, new TextValueView() { Id = null, Title = "همه" });
            return list;
        }

        public List<TextValueView> LoadVisitorGroupByAreaId(IdView areaId)
        {
            var list = _visitorService.LoadVisitorGroup(areaId.Id).ToList();
            list.Insert(0, new TextValueView() { Id = null, Title = "انتخاب کنید..." });
            return list;
        }

        public List<TextValueView> LoadVisitorByGroupId(IdView groupId)
        {
            var list = groupId == null ? new List<TextValueView>() : _visitorService.LoadVisitorByGroupId(groupId.Id);
            return list;
        }

        public List<PointView> LoadMarkers(VisitorMarkerCondition filter)
        {
            var marker = new List<PointView>();

            marker = _transactionService.LoadTransactionList(filter.VisitorIds,
                            filter.Order,
                            filter.LackOrder,
                            filter.LackVisit,
                            filter.StopWithoutCustomer,
                            filter.StopWithoutActivity);
            return marker;
        }

        public List<PolyView> LoadVisitorsPath(VisitorPathCondition filter)
        {
            var lines = new List<PolyView>();
            if (filter.VisitorPath)
            {
                var points = _visitorService.LoadVisitorPath(filter.Date, filter.VisitorIds);
                lines.AddRange(GeneralTools.PointListToPolyList(points, false, false));
            }

            if (filter.DailyPath)
            {
                var points = _visitorService.LoadDailyPath(filter.Date, filter.VisitorIds);
                lines.AddRange(GeneralTools.PointListToPolyList(points, false, false));
            }
            return lines;
        }


        
        /*

        public VisitorModel MapVisitorModel(VisitorConditionModel filter)
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
            
            return model;
        }

 */
    }
}
