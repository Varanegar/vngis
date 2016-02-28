using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Models
{

    public class MapModel
    {
        public List<PointView> Points { set; get; }
        public IList<TrackingMap.Models.PolyModel> Lines { set; get; }
        public IList<TrackingMap.Models.PolyModel> Polygons { set; get; }

        public MapModel()
        {
            Points = new List<PointView>();
            Lines = new List<PolyModel>();
            Polygons = new List<PolyModel>();
        }
    }
}