﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TrackingMap.Service.ViewModel;
using TrackingMap.Vn.ViewModel;

namespace TrackingMap.Controllers
{
    public class VnController : ApiController
    {
        [HttpPost]
        public List<VnCustomerView> LoadCustomer(AutoCompleteFilter filter)
        {
            var list = new List<VnCustomerView>();
            list.Add(new VnCustomerView(){Id=Guid.NewGuid(), CustomerCode = "1", CustomerName= "مصدق"});
            list.Add(new VnCustomerView(){Id=Guid.NewGuid(), CustomerCode = "1", CustomerName= "ابن سینا"});
            list.Add(new VnCustomerView() { Id = Guid.NewGuid(), CustomerCode = "1", CustomerName = "شعله رنوفی" });
            list.Add(new VnCustomerView() { Id = Guid.NewGuid(), CustomerCode = "1", CustomerName = "سعیده قدس" });
            list.Add(new VnCustomerView() { Id = Guid.NewGuid(), CustomerCode = "1", CustomerName = "امیر کبیر" });
            list.Add(new VnCustomerView() { Id = Guid.NewGuid(), CustomerCode = "1", CustomerName = "مسیح علی نژاد" });
            list.Add(new VnCustomerView() { Id = Guid.NewGuid(), CustomerCode = "1", CustomerName = "فریدون فرخزاد" });
            return list.Where(x => x.CustomerName.Contains(filter.searchvalue)).ToList();
        }

    }
}