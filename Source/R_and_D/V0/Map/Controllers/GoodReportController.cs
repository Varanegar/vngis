using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrackingMap.Common.Enum;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Service.Vn.BL;
using TrackingMap.Service.Vn.Extention;

namespace TrackingMap.Controllers
{
    public class GoodReportController : ApiController
    {

        private readonly AreaPointService _areaPointService;
        private readonly AreaService _areaService;
        private readonly GoodReportService _goodReportService;
        private readonly VnGoodReportService _vnGoodReportService;

        public GoodReportController(
            AreaPointService areaPointService,
            AreaService areaService,
            GoodReportService goodReportService,
            VnGoodReportService vnGoodReportService)
        {
            _areaPointService = areaPointService;
            _areaService = areaService;
            _vnGoodReportService = vnGoodReportService;
            _goodReportService = goodReportService;
        }


        public List<PolyView> Load(GoodReportFilter filter)
        {
            if (filter.ChangeFilter)
            {
                var list = _vnGoodReportService.LoadGoodReport(filter);
                _goodReportService.UpdateReportCache(filter.ClientId, list);
            }

            var polies = new List<PolyView>();
            foreach (Guid id in filter.AreaIds)
            {
                // var view = _areaService.GetViewById(id);
                var points = _areaPointService.LoadAreaPointById(id).ToList();
                var rep = _goodReportService.LoadGoodReport(id, filter);

                var poly = new PolyView
                {
                    Points = points,
                    MasterId = id,
                    Desc = rep.Title,
                    Lable = rep.Lable,
                    IsLeaf = rep.IsLeaf,
                    JData = rep.JDesc
                };


                polies.Add(poly);
            }

            return polies;
        }

        [HttpPost]
        public void RemoveCacheData(IdView id)
        {
            if ((id != null) && (id.Id != null))
                _goodReportService.RemoveByClientId(id.Id.Value);
        }

        [HttpPost]

        public List<PointView> LoadCustomer(GoodReportCustomerFilter filter)
        {
            LogService.InsertLog("start ", "good report customer", ELogLevel.DEBUG);
            //var guids = new PagingList<Guid>();
            //foreach (var idView in ids)
            //{
            //    if (idView != null && idView.Id != null) 
            //        guids.Add(idView.Id ?? Guid.NewGuid());    
            //}
            
            var data = _goodReportService.LoadCustomer(filter);
            return data;
            LogService.InsertLog("end ", "good report customer", ELogLevel.DEBUG);

        }
    
}



}
