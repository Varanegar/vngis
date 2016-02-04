using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace TrackingMap.Models
{
    public class PolyModel
    {
        public Color Color { set; get; }
        public IList<TrackingMap.Service.ViewModel.PointView> Points { set; get; }
    }

}