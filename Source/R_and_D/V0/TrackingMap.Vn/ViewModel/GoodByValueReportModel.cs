using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Vn.ViewModel
{
    public class GoodByValueReportFilter
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

        public int? FromRequestCount { set; get; }
        public int? ToRequestCount { set; get; }

        public int? FromFactorCount { set; get; }
        public int? ToFactorCount { set; get; }

        public int? FromRejectCount { set; get; }
        public int? ToRejectCount { set; get; }

        public int? FromSaleItemCount { set; get; }
        public int? ToSaleItemCount { set; get; }

        public int? FromRejectItemCount { set; get; }
        public int? ToRejectItemCount { set; get; }

        public decimal? FromSaleAmount { set; get; }
        public decimal? ToSaleAmount { set; get; }

        public decimal? FromRejectAmount { set; get; }
        public decimal? ToRejectAmount { set; get; }

        public decimal? FromSalePrice { set; get; }
        public decimal? ToSalePrice { set; get; }

        public decimal? FromRejectPrice { set; get; }
        public decimal? ToRejectPrice { set; get; }

        public decimal? FromSaleWeight { set; get; }
        public decimal? ToSaleWeight { set; get; }

        public decimal? FromRejectWeight { set; get; }
        public decimal? ToRejectWeight { set; get; }

        public decimal? FromSaleDiscount { set; get; }
        public decimal? ToSaleDiscount { set; get; }

        public decimal? FromRejectDiscount { set; get; }
        public decimal? ToRejectDiscount { set; get; }

        public int? FromBonusCount { set; get; }
        public int? ToBonusCount { set; get; }

        public decimal? FromBonusAmount { set; get; }
        public decimal? ToBonusAmount { set; get; }

    }

    public class GoodByValueReportView
    {
        public Guid Id { set; get; }
        public string Desc { set; get; }
        public double Longitude { set; get; }
        public double Latitude { set; get; }
    }
}
