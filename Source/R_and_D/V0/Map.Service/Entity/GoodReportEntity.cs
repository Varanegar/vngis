using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;
using TrackingMap.Common.ViewModel;

namespace TrackingMap.Service.Entity
{
    [Table("GoodReportCache")]
    public class GoodReportEntity : BaseEntityWithouteAutoIncId
    {
        //  public DbGeometry CPoint { set; get; }
        public Guid Id { get; set; }

        public Guid ClientId { set; get; }
        public string Desc { set; get; }
        public int? OrderCount { set; get; }
        public int? SaleCount { set; get; }
        public int? RetSaleCount { set; get; }
        public int? SaleItemCount { set; get; }
        public int? RetSaleItemCount { set; get; }
        public double? SaleQty { set; get; }
        public double? SaleCarton { set; get; }
        public decimal? SaleAmount { set; get; }
        public double? RetSaleQty { set; get; }
        public double? RetSaleCarton { set; get; }
        public decimal? RetSaleAmount { set; get; }
        public double? SaleWeight { set; get; }
        public double? RetSaleWeight { set; get; }
        public decimal? SaleDiscount { set; get; }
        public decimal? RetSaleDiscount { set; get; }
        public int? SalePrizeCount { set; get; }
        public double? PrizeQty { set; get; }
        public double? PrizeCarton { set; get; }

        public GoodReportEntity()
        {
        }

        public GoodReportEntity( Guid clientId, VnGoodReportView view)
        {
            this.Id = Guid.NewGuid();
            this.ClientId = clientId; 
           // this.CPoint = view.CPoint;
            this.OrderCount = view.OrderCount;
            this.SaleCount = view.SaleCount;
            this.RetSaleCount = view.RetSaleCount;
            this.SaleItemCount  = view.SaleItemCount;
            this.RetSaleItemCount = view.RetSaleItemCount;
            this.SaleAmount  = view.SaleAmount;
            this.RetSaleAmount = view.RetSaleAmount;
            this.SaleQty  = view.SaleQty;
            this.RetSaleQty = view.RetSaleQty;
            this.SaleCarton  = view.SaleCarton;
            this.RetSaleCarton = view.RetSaleCarton;
            this.SaleWeight  = view.SaleWeight;
            this.RetSaleWeight = view.RetSaleWeight;
            this.SaleDiscount  = view.SaleDiscount;
            this.RetSaleDiscount = view.RetSaleDiscount;
            this.SalePrizeCount = view.SalePrizeCount;
            this.PrizeQty = view.PrizeQty;
            this.PrizeCarton = view.PrizeCarton;
            this.IntId = view.CustRef;
        }
    }


}
