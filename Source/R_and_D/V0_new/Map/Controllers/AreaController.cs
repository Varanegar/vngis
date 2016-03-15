using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using Jmelosegui.Mvc.GoogleMap;
using Microsoft.Owin.Security.Google;
using TrackingMap.Service.BL;
using TrackingMap.Service.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Models;
using WebGrease.Css.Ast.Selectors;
using System.Web.Http;

namespace TrackingMap.Controllers
{
    public class AreaController : ApiController
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

        //public ActionResult Index()
        //{
        //    ViewBag.CurrMenu = "Area";
        //    return View();
        //}
        [HttpPost]
        public IList<AreaView> LoadAreaList()
        {
            var AreaList = _areaService.LoadAreaByParentId(null);
            return AreaList;
        }

        public IList<AreaView> LoadAreaList(Guid? parentId)
        {
            var AreaList = _areaService.LoadAreaByParentId(parentId);
            return AreaList;
        }

        public bool HasAreaPoint(Guid id)
        {
            var haspoint = _areaPointService.HaseAreaPoint(id);
            return haspoint;
        }
        public IList<AreaView> GetAreaPath(Guid? id)
        {
            var haspoint = _areaService.GetAreaPathById(id);
            return haspoint;
        }

        public List<CustomerView> GetSelectedCustomer(Guid parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId, true);
            return CustomerList;
        }
        public List<CustomerView> GetNotSelectedCustomer(Guid parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId, false);
            return CustomerList;
        }

        public bool AddCustomerToSelected(Guid customerId, Guid areaId)
        {
            var r = _areaService.AddCustomerToSelected(customerId,  areaId);
            return r;
        }

        public bool RemoveCustomerFromSelected(Guid customerId, Guid areaId)
        {
            return _areaService.RemoveCustomerFromSelected(customerId, areaId);
        }
        
        //-----------------------------------------------------------------------------------------------------------
        //  MAP
        //-----------------------------------------------------------------------------------------------------------
        public ReturnValue SaveAreaPoint(Guid id, AreaPointView[] markers)
        {
            _areaPointService.SaveAreaPointList(id, markers.ToList());
            return new ReturnValue{ Success = true };
            //Redirect("GooglemapLimiteView", new { id });
        }
        public ReturnValue RemoveAreaPointsByAreaId(Guid id)
        {
            return new ReturnValue{ Success = _areaPointService.RemoveAreaPointsByAreaId(id) };
            //Redirect("GooglemapLimiteView", new { id });
        }

        public AreaModel GooglemapAreaView(Guid id, bool editable,
                bool showcust,
                bool showcustrout,
                bool showcustotherrout,
                bool showcustwithoutrout)
        {
            var model = new AreaModel();

            var view = _areaService.GetViewById(id);
            var parentid = _areaService.GetParentIdById(id);
            //---------------------------------------
            //  show parent limit
            //---------------------------------------
            if (parentid != null)
            {
                var parentpoints = _areaPointService.LoadAreaPointById(parentid).ToList();
                if (parentpoints.Any())
                {
                    parentpoints.Add(parentpoints.ElementAt(0));
                }
                model.ParentPoints = parentpoints;
            }




            if (editable)
            {
                //---------------------------------------
                //  show sibling limit
                //---------------------------------------
                if (parentid != null)
                {
                    var siblingpoints = _areaPointService.LoadAreaPointByParentId(parentid).ToList();
                    model.SiblingPoints = GeneralTools.PointListToPolyList(siblingpoints, true , false);
                }
            }
            else
            {
                //---------------------------------------
                //  show child limit
                //---------------------------------------
                if (!view.IsLeaf)
                {
                    var childgpoints = _areaPointService.LoadAreaPointByParentId(view.Id).ToList();
                    model.SiblingPoints = GeneralTools.PointListToPolyList(childgpoints, true, false);                    
                }
            }

            if (view.IsLeaf)
            {

                //---------------------------------------
                //  show customer markers
                //---------------------------------------
                if (showcustrout || showcustotherrout || showcustwithoutrout)
                {
                    var customerpoints = _customerService.LoadCustomerByAreaId(parentid, id,
                        showcustrout, showcustotherrout, showcustwithoutrout);
                    model.CustomerPoints = customerpoints;
                }

            }
            else
            {
                //---------------------------------------
                //  show customer markers
                //---------------------------------------
                if (showcust)
                {
                    var customerpoints = _customerService.LoadCustomerByAreaId(id);
                    model.CustomerPoints = customerpoints;
                }
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
                model.Color = Color.LightSalmon;
            }
            
            if (points.Count > 0)
                model.Center = points.ElementAt(0);
            else
            {
                if (model.ParentPoints.Count > 0)
                    model.Center = model.ParentPoints.ElementAt(0);
                else
                    model.Center = new PointView() { Longitude = 51.4230556, Latitude = 35.6961111 };
            }
            model.EditMode = editable;
            model.IsLeaf = view.IsLeaf;
            return model; // this.PartialView("_GooglemapAreaPartialView", model);
        }
    }
}