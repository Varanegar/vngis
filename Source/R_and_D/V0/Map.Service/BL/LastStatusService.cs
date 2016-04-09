using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Common.ViewModel;
using TrackingMap.Common.Enum;

namespace TrackingMap.Service.BL
{
    public class LastStatusService
    {

        

        public List<PointView> LoadMarkerList(List<Guid> ids)
        {
            var markers = new List<PointView>();
            markers.Add(new PointView()
            {
                Latitude = 35.7888548816888,
                Longitude = 51.3600540161133,
                Lable = "بازاریاب 1",
                PointType = PointType.GpsOff
            });

            markers.Add(new PointView()
            {
                Latitude = 35.7588548816888,
                Longitude = 51.3700540161133,
                Lable = "بازاریاب 2",
                PointType = PointType.Order
            });

            return markers;
        }
    }
}
