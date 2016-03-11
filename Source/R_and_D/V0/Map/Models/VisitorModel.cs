﻿using System;
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
            VisitorIds = new List<Guid>();

        }

        //-------------------
        public IList<SelectListItem> AvailableArea { get; set; }


        //-------------------
        public List<Guid> VisitorIds { get; set; }
        public string Date { get; set; }
        public bool DailyPath { get; set; }
        public bool VisitorPath { get; set; }
        public bool Order { get; set; }
        public bool LackOrder { get; set; }
        public bool LackVisit { get; set; }
        public bool StopWithoutCustomer { get; set; }
        public bool StopWithoutActivity { get; set; }
    }

}