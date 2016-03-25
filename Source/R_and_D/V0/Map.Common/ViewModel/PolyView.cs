using System.Collections.Generic;
using System.Drawing;

namespace TrackingMap.Common.ViewModel
{
    public class PolyView
    {
        public List<PointView> Points { set; get; }
        public string Color { set; get; }
        public string Desc { set; get; }
    }
}
