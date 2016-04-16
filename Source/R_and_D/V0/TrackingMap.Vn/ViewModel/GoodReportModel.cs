using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Vn.ViewModel
{
    public class GoodReportFilter
    {
        public Guid[] AreaIds { set; get; }
        public int Type { set; get; }
        public string FromDate { set; get; }
        public string ToDate { set; get; }
        public Guid? SaleOffice { set; get; }
        public Guid? Header { set; get; }
        public Guid? Seller { set; get; }
        public Guid? CustomerClass { set; get; }
        public Guid? CustomerActivity { set; get; }
        public Guid? CustomerDegree { set; get; }
        public Guid? GoodGroup { set; get; }
        public Guid? DynamicGroup { set; get; }
        public Guid? Good { set; get; }
        public string CommercialName { set; get; }
        public int? DayCount { set; get; }
        public bool RequestCount { set; get; }
        public bool FactorCount { set; get; }
        public bool RejectCount { set; get; }
        public bool SaleItemCount { set; get; }
        public bool RejectItemCount { set; get; }
        public bool SaleAmount { set; get; }
        public bool RejectAmount { set; get; }
        public bool SalePrice { set; get; }
        public bool RejectPrice { set; get; }
        public bool SaleWeight { set; get; }
        public bool RejectWeight { set; get; }
        public bool SaleDiscount { set; get; }
        public bool RejectDiscount { set; get; }
        public bool BonusCount { set; get; }
        public bool BonusAmount { set; get; }

    }
    public class GoodReportView
    {
        public Guid? AreaId { set; get; }
        public string Desc { set; get; }
        public int? RequestCount { set; get; }
        public int? FactorCount { set; get; }
        public int? RejectCount { set; get; }
        public int? SaleItemCount { set; get; }
        public int? RejectItemCount { set; get; }
        public decimal? SaleAmount { set; get; }
        public decimal? RejectAmount { set; get; }
        public decimal? SalePrice { set; get; }
        public decimal? RejectPrice { set; get; }
        public decimal? SaleWeight { set; get; }
        public decimal? RejectWeight { set; get; }
        public decimal? SaleDiscount { set; get; }
        public decimal? RejectDiscount { set; get; }
        public int? BonusCount { set; get; }
        public int? BonusAmount { set; get; }

    }


}
