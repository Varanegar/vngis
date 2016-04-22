﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TrackingMap.UI.Controllers
{
    public class GoodReportController : Controller
    {
        // GET: GoodReport
        public ActionResult Index()
        {
            ViewBag.CurrMenu = "GoodReport";
            ViewBag.Title = CaptionResource.GoodReport;
            return View();
        }
    }
}