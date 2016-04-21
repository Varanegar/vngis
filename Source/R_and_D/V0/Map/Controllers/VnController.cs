using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.BL;
using TrackingMap.Service.ViewModel;
using TrackingMap.Service.Vn.BL;

namespace TrackingMap.Controllers
{
    public class VnController : ApiController
    {
        private readonly VnService _vnService;
        private readonly CustomerService _customerService;

        public VnController(VnService vnService,
            CustomerService customerService)
        {
            _vnService = vnService;
            _customerService = customerService;
        }

        [HttpPost]
        public List<VnCustomerView> LoadCustomer(AutoCompleteFilter filter)
        {
            return _customerService.LoadCustomerAutoComplete(filter);
        }

        [HttpPost]
        public List<TextValueView> GetComboData(ComboFilter filter)
        {
            return _vnService.GetComboData(filter);
        }

        [HttpPost]
        public List<TextValueView> GetAutoCompleteData(AutoCompleteFilter filter)
        {
            return _vnService.GetAutoCompleteData(filter);
        }


    }
}
