using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.ViewModel
{
    public class AreaPointView
    {
        public int Id { set; get; }
        public int MasterId { set; get; }
        public double Lng { set; get; }
        public double Lat { set; get; }
    }
}
