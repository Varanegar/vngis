using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
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
            for (var i = 0; i < filter.AreaIds.Length; i++)
            {
                var view = _areaService.GetViewById(filter.AreaIds[i]);
                var points = _areaPointService.LoadAreaPointById(filter.AreaIds[i]).ToList();
                var poly = new PolyView();
                poly.Points = points;
                poly.MasterId = filter.AreaIds[i];
                poly.Lable = view.Title;
                poly.IsLeaf = view.IsLeaf;
                var rep  = _customerReportService.LoadCustomerReport(poly.MasterId ,filter);
                poly.Desc = rep.GetHtml();

                polies.Add(poly);
            }

            return polies;
        }

    }
}
