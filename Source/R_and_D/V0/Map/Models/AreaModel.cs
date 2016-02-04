using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace TrackingMap.Models
{
    public class AreaModel
    {
        [ResourceDisplayName("Areas")]
        public IList<SelectListItem> AvailableAreasGroup { get; set; }
    }

  

}