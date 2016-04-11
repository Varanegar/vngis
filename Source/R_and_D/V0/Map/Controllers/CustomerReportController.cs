using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Service.Tools;
using TrackingMap.Vn.ViewModel;
using TrackingMap.Vn.Extention;

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

            var childgpoints = _areaPointService.LoadAreaPointByParentId(filter.ParentId).ToList();
            polies = GeneralTools.PointListToPolyList(childgpoints, true, false);
            foreach (var poly in polies)
            {
                var view = _areaService.GetViewById(poly.MasterId);
                poly.Lable = view.Title;
                
                var viw  = _customerReportService.LoadCustomerReport(poly.MasterId ,filter);
                poly.Desc = viw.GetHtml();
            }

            return polies;
        }

    }
}
