using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Service.Vn.Extention;

namespace TrackingMap.Controllers
{
    public class CustomerReportController : ApiController
    {
        private readonly CustomerReportService _customerReportService;
        private readonly AreaPointService _areaPointService;
        private readonly AreaService _areaService;
        public CustomerReportController(CustomerReportService customerReportService,
            AreaPointService areaPointService,
            AreaService areaService)
        {
            _customerReportService = customerReportService;
            _areaPointService = areaPointService;
            _areaService = areaService;
        }
        public List<PolyView> Load(CustomerReportFilter filter)
        {
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
                    Desc = view.Title,
                    IsLeaf = view.IsLeaf
                };
                var rep = _customerReportService.LoadCustomerReport(poly.MasterId, filter);
                poly.JData = JsonTools.ObjectToJson(rep);
                polies.Add(poly);
            }

            return polies;
        }

    }
}
