using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Controllers
{
    public class LastStatusController : ApiController
    {
        private readonly LastStatusService _lastStatusService;

        public LastStatusController(LastStatusService lastStatusService) {
            _lastStatusService = lastStatusService;
        }

        public List<PointView> LoadMarkers(LastStatusCondition filter)
        {
            var marker = new List<PointView>();

            marker = _lastStatusService.LoadMarkerList(filter.VisitorIds);
            return marker;
        }



    }
}
