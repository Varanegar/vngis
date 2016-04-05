using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using Microsoft.Owin.Security.Google;
using TrackingMap.Service.BL;
using TrackingMap.Service.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Models;
using WebGrease.Css.Ast.Selectors;
using System.Web.Http;
using System.Web.Http.Cors;

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

        [HttpPost]
        public IList<AreaView> LoadAreaList(IdView parent)
        {

            var AreaList = _areaService.LoadAreaByParentId((parent == null ? null : parent.Id));
            return AreaList;
        }

        [HttpPost]
        public bool HasAreaPoint(IdView areaView)
        {
            var haspoint = _areaPointService.HaseAreaPoint(areaView.Id);
            return haspoint;
        }

        [HttpPost]
        public IList<AreaView> GetAreaPath(IdView areaView)
        {
            var haspoint = _areaService.GetAreaPathById(areaView.Id);
            return haspoint;
        }


        [HttpPost]
        public List<CustomerView> LoadSelectedCustomer(IdView parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId.Id, true);
            return CustomerList;
        }

        [HttpPost]
        public List<CustomerView> LoadNotSelectedCustomer(IdView parentId)
        {
            var CustomerList = _areaService.LoadCustomerSelectedByAreaId(parentId.Id, false);
            return CustomerList;
        }

        [HttpPost]
        public bool AddCustomerToSelected(CustomerAreaView customer)
        {
            
            var r = _areaService.AddCustomerToSelected(customer.CustomerId, customer.AreaId);
            return r;
        }

        [HttpPost]
        public bool RemoveCustomerFromSelected(CustomerAreaView customer)
        {
            return _areaService.RemoveCustomerFromSelected(customer.CustomerId, customer.AreaId);
        }
        
        //-----------------------------------------------------------------------------------------------------------
        //  MAP
        //-----------------------------------------------------------------------------------------------------------
        public ReturnValue SaveAreaPoint(AreaPointListView areaPoints)
        {
            _areaPointService.SaveAreaPointList(areaPoints.Id, areaPoints.Points);
            return new ReturnValue{ Success = true };
            //Redirect("GooglemapLimiteView", new { id });
        }
        public ReturnValue RemoveAreaPointsByAreaId(IdView areaId)
        {
            return new ReturnValue{ Success = _areaPointService.RemoveAreaPointsByAreaId(areaId.Id) };
            //Redirect("GooglemapLimiteView", new { id });
        }


        //---------------------------------------
        //  load curent area or route point
        //---------------------------------------
        public PolyView LoadAreaPoints(IdView areaId)
        {
            var poly = new PolyView();
            var points = _areaPointService.LoadAreaPointById(areaId.Id);
            poly.Color = "#000000";
            poly.Desc = "";
            poly.Points = points;
            return poly; 
        }

        //---------------------------------------
        //  load parent limit
        //---------------------------------------
        public PolyView LoadAreaParentPoints(IdView areaId)
        {
            var poly = new PolyView();

            var parentid = _areaService.GetParentIdById(areaId.Id);

            if (parentid != null)
            {
                var parentpoints = _areaPointService.LoadAreaPointById(parentid).ToList();
                if (parentpoints.Any())
                {
                    parentpoints.Add(parentpoints.ElementAt(0));
                }
                poly.Points = parentpoints;
                poly.Color = "#888888";
                poly.Desc = "";
            }
            return poly;
        }        
        
        public List<PolyView> LoadAreaSibilingPoints(IdView areaId)
        {
            var polies = new List<PolyView>();

            var parentid = _areaService.GetParentIdById(areaId.Id);

            if (parentid != null)
            {
                var siblingpoints = _areaPointService.LoadAreaPointByParentId(parentid, areaId.Id).ToList();
                polies = GeneralTools.PointListToPolyList(siblingpoints, true, false);
            }            
            return polies;
        }

        public List<PolyView> LoadAreaChildPoints(IdView areaId)
        {
            var polies = new List<PolyView>();

            var childgpoints = _areaPointService.LoadAreaPointByParentId(areaId.Id).ToList();
            polies = GeneralTools.PointListToPolyList(childgpoints, true, false);                    

            return polies;
        }

        public List<PointView> LoadAreaCustomerPoints(IdView areaId)
        {
            var customerpoints = _customerService.LoadCustomerByAreaId(areaId.Id);
            return customerpoints;
        }

        public List<PointView> LoadAreaLeafCustomerPoints(AreaCondition filter)
        {
            var parentid = _areaService.GetParentIdById(filter.Id);
            var customerpoints = _customerService.LoadCustomerByAreaId(parentid, filter.Id,
                filter.Showcustrout, filter.Showcustotherrout, filter.Showcustwithoutrout);
            return customerpoints;
        }
/*
        public AreaModel MapAreaModel(AreaConditionModel condition)
        {
            var model = new AreaModel();

            var view = _areaService.GetViewById(condition.Id);
            var parentid = _areaService.GetParentIdById(condition.Id);
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




            if (condition.Editable)
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
                if (condition.Showcustrout || condition.Showcustotherrout || condition.Showcustwithoutrout)
                {
                    var customerpoints = _customerService.LoadCustomerByAreaId(parentid, condition.Id,
                        condition.Showcustrout, condition.Showcustotherrout, condition.Showcustwithoutrout);
                    model.CustomerPoints = customerpoints;
                }

            }
            else
            {
                //---------------------------------------
                //  show customer markers
                //---------------------------------------
                if (condition.Showcust)
                {
                    var customerpoints = _customerService.LoadCustomerByAreaId(condition.Id);
                    model.CustomerPoints = customerpoints;
                }
            }

            //---------------------------------------
            //  show curent area or route point
            //---------------------------------------
            var points = _areaPointService.LoadAreaPointById(condition.Id);
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
            model.EditMode = condition.Editable;
            model.IsLeaf = view.IsLeaf;
            return model; // this.PartialView("_GooglemapAreaPartialView", model);
        }
 */ 
    }
}