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
        private readonly CustomerService _customerService;
        public AreaController(AreaPointService areaPointService,
            AreaService areaService, CustomerService customerService)
        {
            _areaPointService = areaPointService;
            _areaService = areaService;
            _customerService = customerService;

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

        public ActionResult GetSelectedCustomer(int parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId, true);
            return Json(CustomerList);
        }
        public ActionResult GetNotSelectedCustomer(int parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId, false);
            return Json(CustomerList);
        }

        public ActionResult AddCustomerToSelected(int customerId, int areaId)
        {
            var r = _areaService.AddCustomerToSelected(customerId,  areaId);
            return Json(r);
        }

        public ActionResult RemoveCustomerFromSelected(int customerId, int areaId)
        {
            var r = _areaService.RemoveCustomerFromSelected(customerId, areaId);
            return Json(r);
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
        public ActionResult GooglemapAreaView(int id,bool showcust)
        {
            var model = new AreaModel();
            var parentpoints = new List<PointView>();
            var customerpoints = new List<PointView>();

            var view = _areaService.GetViewById(id);
            var parentid = _areaService.GetParentIdById(id);

            //---------------------------------------
            //  show parent limit
            //---------------------------------------
            if (parentid != 0)
            {
                parentpoints = _areaPointService.LoadAreaPointById(parentid).ToList();
                if (parentpoints.Count() > 0){
                    parentpoints.Add(parentpoints.ElementAt(0));
                }
                model.ParentPoints = parentpoints;
            }

            //---------------------------------------
            //  show customer markers
            //---------------------------------------
            if (showcust)
            {
                if (view.IsLeaf)
                    customerpoints = _customerService.LoadCustomerByAreaId(parentid);
                else
                    customerpoints = _customerService.LoadCustomerByAreaId(id);
                model.CustomerPoints = customerpoints; 
            }

            //---------------------------------------
            //  show curent area or route point
            //---------------------------------------
            var points = _areaPointService.LoadAreaPointById(id);
            if (view.IsLeaf)
            {
                model.LinePoints = points;
                model.Color = Color.Red;
            }
            else{
                model.AreaPoints = points;
                model.Color = Color.Orange;
            }

            return this.PartialView("_GooglemapAreaPartialView", model);
        }
    }
}