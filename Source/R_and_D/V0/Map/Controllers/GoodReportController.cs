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
    public class GoodReportController : ApiController
    {

        private readonly AreaPointService _areaPointService;
        private readonly AreaService _areaService;
        public GoodReportController(CustomerReportService customerReportService,
            AreaPointService areaPointService,
            AreaService areaService)
        {
            _areaPointService = areaPointService;
            _areaService = areaService;
        }
        public List<PolyView> Load(GoodReportFilter filter)
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


                var rep = new GoodReportView()
                {
                    BonusAmount = 10,
                    Desc = "test",
                    SaleAmount = 20000,
                    SalePrice = 9007000
                };

                poly.Desc = rep.GetHtml();

                polies.Add(poly);
            }

            return polies;
        }

    }



}
