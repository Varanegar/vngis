﻿using System;
using System.Collections.Generic;
using System.Web.Http;
using TrackingMap.Common.Enum;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Service.Vn.BL;
using TrackingMap.Service.Vn.Extention;

namespace TrackingMap.Controllers
{
    public class GoodByValueReportController : ApiController
    {
        private readonly GoodByValueReportService _goodByValueReportService;
        private readonly VnGoodReportService _vnGoodReportService;
        private readonly GoodReportService _goodReportService;

        public GoodByValueReportController(GoodByValueReportService goodByValueReportService,
            GoodReportService goodReportService,
            VnGoodReportService vnGoodReportService)
        {
            _goodByValueReportService = goodByValueReportService;
            _vnGoodReportService = vnGoodReportService;
            _goodReportService = goodReportService;

        }

        public List<PointView> Load(GoodByValueReportFilter filter)
        {
            LogService.InsertLog("start ", "good value report", ELogLevel.DEBUG);
            if (filter.ChangeFilter)
            {
                LogService.InsertLog("insert date to chach ", "good value report", ELogLevel.DEBUG);
                var list = _vnGoodReportService.LoadGoodReport(filter);
                _goodReportService.UpdateReportCache(filter.ClientId, list);
            }

            var points = new List<PointView>();
            foreach (Guid id in filter.AreaIds)
            {
                LogService.InsertLog("get data ", "good value report", ELogLevel.DEBUG);
                var point = _goodByValueReportService.LoadGoodByValueReport(id, filter);
                points.AddRange(point);
            }
            //foreach (var good in list)
            //{
            //    var desc = good.GetHtml();
            //    points.Add(new PointView()
            //    {
            //        Id = good.Id,
            //        Desc = desc,
            //        Latitude = good.Latitude,
            //        Longitude = good.Longitude
            //    });
            //}
            LogService.InsertLog("end ", "good value report", ELogLevel.DEBUG);

            return points;
        }



    }
}
