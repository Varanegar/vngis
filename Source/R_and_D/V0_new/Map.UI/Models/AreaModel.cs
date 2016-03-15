using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using TrackingMap.Common.ViewModel;

namespace TrackingMap.UI.Models
{
    public class AreaModel
    {
        public PointView Center { set; get; }
        public Color Color { set; get; }
        public bool EditMode { set; get; }
        public bool IsLeaf { set; get; }
        public IList<PointView> AreaPoints { set; get; }
        public IList<PointView> ParentPoints { set; get; }
        public IList<PolyView> ChiledPoints { set; get; }
        public IList<PolyView> SiblingPoints { set; get; }
        public IList<PointView> CustomerPoints { set; get; }
        public IList<PointView> LinePoints { set; get; }

        public AreaModel() { 
          AreaPoints = new List<PointView>();
          LinePoints = new List<PointView>();
          ParentPoints = new List<PointView>();
          ChiledPoints = new List<PolyView>();
          SiblingPoints = new List<PolyView>();
          CustomerPoints = new List<PointView>();
        }
    }

}