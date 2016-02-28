using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TrackingMap.Models
{
    public class ReportModel
    {

        [ResourceDisplayName("VisitorGroup")]
        public IList<SelectListItem> AvailableVisitorGroup { get; set; }

        [ResourceDisplayName("CustomerGroup")]
        public IList<SelectListItem> AvailableCustomerGroup { get; set; }

        [ResourceDisplayName("GoodGroup")]
        public IList<SelectListItem> AvailableGoodGroup { get; set; }

        [ResourceDisplayName("Driver")]
        public IList<SelectListItem> AvailableDriver { get; set; }

        [ResourceDisplayName("Distributer")]
        public IList<SelectListItem> AvailableDistributer { get; set; }

        [ResourceDisplayName("RoadGroup")]
        public IList<SelectListItem> AvailableRoadGroup { get; set; }

        [ResourceDisplayName("AreaGroup")]
        public IList<SelectListItem> AvailableAreaGroup { get; set; }

        [ResourceDisplayName("Activity")]
        public IList<SelectListItem> AvailableActivity { get; set; }

    }
}