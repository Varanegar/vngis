using System.Collections.Generic;
using System.Web.Mvc;

namespace TrackingMap.Models
{


    public class TrackerConditionModel
    {
        [ResourceDisplayName("VisitorGroup")]
        public IList<SelectListItem> AvailableVisitorGroup { get; set; }
        
        [ResourceDisplayName("Driver")]
        public IList<SelectListItem> AvailableDriver { get; set; }

    }


}