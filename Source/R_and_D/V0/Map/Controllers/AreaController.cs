using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Jmelosegui.Mvc.GoogleMap;
using Microsoft.Owin.Security.Google;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Models;

namespace TrackingMap.Controllers
{
    public class AreaController : Controller
    {

        private readonly AreaService _areaService;
        private readonly AreaPointService _areaPointService;
        public AreaController(AreaPointService areaPointService,
            AreaService areaService)
        {
            _areaPointService = areaPointService;
            _areaService = areaService;
        }

        public ActionResult Index()
        {
            ViewBag.CurrMenu = "Area";
            return View();
        }

        public ActionResult GetAreaList(int parentId)
        {
            var AreaList = _areaService.LoadAreaByParentId(parentId);
            return Json(AreaList);
        }

        public ActionResult HasAreaPoint(int id)
        {
            var haspoint = _areaPointService.HaseAreaPoint(id);
            return Json(haspoint);
        }
        public ActionResult GetAreaPath(int id)
        {
            var haspoint = _areaService.GetAreaPathById(id);
            return Json(haspoint);
        }
        
        //-----------------------------------------------------------------------------------------------------------
        //  MAP
        //-----------------------------------------------------------------------------------------------------------
        public ActionResult SaveAreaPoint(int id, AreaPointView[] markers)
        {
            _areaPointService.SaveAreaPointList(id, markers.ToList());
            return Json(new { success = true });
            //Redirect("GooglemapLimiteView", new { id });
        }
        public ActionResult GooglemapAreaView(int id)
        {
            var parentid = _areaService.GetParentIdById(id);
            var parentpoints = new List<PointView>();
            if (parentid != 0)
            {
                parentpoints = _areaPointService.LoadAreaPointById(parentid).ToList();
                if (parentpoints.Count() > 0){
                    parentpoints.Add(parentpoints.ElementAt(0));
                }
                
            }

            var points = _areaPointService.LoadAreaPointById(id);
            var model = new AreaModel();
            model.Points = points;
            model.ParentPoints = parentpoints;
            model.Color = Color.Orange;
            return this.PartialView("_GooglemapAreaPartialView", model);
        }
    }
}