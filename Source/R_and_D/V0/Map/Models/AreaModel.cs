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
        public IList<PointView> AreaPoints { set; get; }
        public IList<PointView> LinePoints { set; get; }

        public IList<PointView> ParentPoints { set; get; }
        public IList<PointView> CustomerPoints { set; get; }

        public AreaModel() { 
          AreaPoints = new List<PointView>();
          LinePoints = new List<PointView>();
          ParentPoints = new List<PointView>();
          CustomerPoints = new List<PointView>();
        }
    }

}