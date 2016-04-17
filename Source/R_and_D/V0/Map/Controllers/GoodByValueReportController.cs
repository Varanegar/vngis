using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Vn.ViewModel;
using TrackingMap.Vn.Extention;

namespace TrackingMap.Controllers
{
    public class GoodByValueReportController : ApiController
    {
        private readonly GoodByValueReportService _goodByValueReportService;
        public GoodByValueReportController(GoodByValueReportService goodByValueReportService
            )
        {
            _goodByValueReportService = goodByValueReportService;
        }

        public List<PointView> Load(GoodByValueReportFilter filter)
        {
            var points = new List<PointView>();

            //TODO load good by value report
            var list = _goodByValueReportService.LoadGoodByValueReport(filter);
            foreach (var good in list)
            {
                var desc = good.GetHtml();
                points.Add(new PointView()
                {
                    Id = good.Id,
                    Desc = desc,
                    Latitude = good.Latitude,
                    Longitude = good.Longitude
                });
            }

            return points;
        }



    }
}
