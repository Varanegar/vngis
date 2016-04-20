using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
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
                var view = _areaService.GetViewById(id);
                var points = _areaPointService.LoadAreaPointById(id).ToList();
                var poly = new PolyView
                {
                    Points = points,
                    MasterId = id,
                    Lable = view.Title,
                    IsLeaf = view.IsLeaf
                };

                var rep = _goodReportService.LoadGoodReport(id, filter);
                poly.Desc = rep.GetHtml(view.Title);

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
    }



}
