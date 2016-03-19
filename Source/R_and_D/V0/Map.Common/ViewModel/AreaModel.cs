using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using TrackingMap.Common.ViewModel;

namespace TrackingMap.Common.ViewModel
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
    public class AreaConditionModel
    {
        public Guid Id{ set; get; }
        public bool Editable{ set; get; }
        public bool Showcust{ set; get; }
        public bool Showcustrout{ set; get; }
        public bool Showcustotherrout{ set; get; }
        public bool Showcustwithoutrout { set; get; }
    }

}