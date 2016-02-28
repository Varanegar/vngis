using System.Collections.Generic;
using System.Web.Mvc;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Models
{

    public class VisitorModel
    {
        public VisitorModel()
        {
            Lines = new List<PolyView>();
            MarkerPoints = new List<PointView>();
        }
        public List<PolyView> Lines { set; get; }
        public List<PointView> MarkerPoints { set; get; }

    }

    public class VisitorConditionModel
    {
        public VisitorConditionModel()
        {
            VisitorIds = new List<int>();

        }

        //-------------------
        public IList<SelectListItem> AvailableVisitorGroup { get; set; }


        //-------------------
        public List<int> VisitorIds { get; set; }
        public string Date { get; set; }
        public bool DailyPath { get; set; }
        public bool VisitorPath { get; set; }
        public bool Order { get; set; }
        public bool LackOrder { get; set; }
        public bool LackVisit { get; set; }
        public bool Wait { get; set; }
        public bool WithoutActivity { get; set; }

    }

}