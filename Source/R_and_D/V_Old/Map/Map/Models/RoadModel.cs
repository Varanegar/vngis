using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace TrackingMap.Models
{
    public class RoadModel
    {
        [ResourceDisplayName("Limits")]
        public IList<SelectListItem> AvailableRoads { get; set; }
    }

  

}