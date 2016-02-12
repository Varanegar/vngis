using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Models
{
    public class AreaModel
    {
        public Color Color { set; get; }
        public IList<PointView> Points { set; get; }

        public IList<PointView> ParentPoints { set; get; }
        
    }

}