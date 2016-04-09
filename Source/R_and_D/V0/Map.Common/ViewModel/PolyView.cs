using System;
using System.Collections.Generic;
using System.Drawing;

namespace TrackingMap.Common.ViewModel
{
    public class PolyView
    {
        public Guid? MasterId { set; get; }
        public List<PointView> Points { set; get; }
        public string Color { set; get; }
        public string Desc { set; get; }
        public string Lable { set; get; }
    }
}
