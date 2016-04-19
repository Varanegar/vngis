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
using TrackingMap.Service.ViewModel;

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
            var CustomerList = _customerService.LoadCustomerSelectedByAreaId(parentId.Id, true);
            return CustomerList;
        }

        [HttpPost]
        public List<CustomerView> LoadNotSelectedCustomer(IdView parentId)
        {
            var CustomerList = _customerService.LoadCustomerSelectedByAreaId(parentId.Id, false);
            return CustomerList;
        }

        [HttpPost]
        public bool AddCustomerToSelected(CustomerAreaView customer)
        {
            
            var r = _areaPointService.AddCustomerToSelected(customer.CustomerId, customer.AreaId);
            return r;
        }

        [HttpPost]
        public bool RemoveCustomerFromSelected(CustomerAreaView customer)
        {
            return _areaPointService.RemoveCustomerFromSelected(customer.CustomerId, customer.AreaId);
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
        //  load multi areas line
        //---------------------------------------
        public List<PolyView> LoadAreasLine(List<Guid> areaIds)
        {
            var polies = new List<PolyView>(); 
            foreach (var areaId in areaIds)
            {
                var poly = new PolyView();
                var points = _areaPointService.LoadAreaPointById(areaId);
                var view = _areaService.GetViewById(areaId);
                poly.MasterId = view.Id;
                poly.Lable = view.Title;
                poly.Color = "#000000";
                poly.Desc = "";
                poly.Points = points;
                polies.Add(poly);

            }
            return polies;
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
                polies = PointTools.PointListToPolyList(siblingpoints, true, false);
            }
            foreach (var poly in polies)
            {               
               var view = _areaService.GetViewById(poly.MasterId);
               poly.Lable = view.Title;
            }
            return polies;
        }

        public List<PolyView> LoadAreaChildPoints(IdView areaId)
        {
            var polies = new List<PolyView>();

            var childgpoints = _areaPointService.LoadAreaPointByParentId(areaId.Id).ToList();
            polies = PointTools.PointListToPolyList(childgpoints, true, false);
            foreach (var poly in polies)
            {
                var view = _areaService.GetViewById(poly.MasterId);
                poly.Lable = view.Title;
            }

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

        //------------------------------------------------------------
        // customer position
        //------------------------------------------------------------
        public ReturnValue SaveCustomerPosition(List<CustomerPointView> points)
        {
            _customerService.SaveCustomerPointList(points);
            return new ReturnValue { Success = true };
            //Redirect("GooglemapLimiteView", new { id });
        }

    }
}