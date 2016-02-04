
using System;

namespace TrackingMap.Service.ViewModel
{
    public class PointView
    {
        public int Id { set; get; }
        public string Desc { set; get; }

        public double Longitude { set; get; }
        
        public double Latitude { set; get; }

        //public DateTime Timestpm { set; get;}

        public PointType PointType { set; get; }

        public int MasterId { set; get; }

    }
}
