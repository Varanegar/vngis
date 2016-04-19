﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;

namespace TrackingMap.Service.BL
{
    public class GoodReportService
    {
        private readonly IDbContext _ctx;

        private IRepository<GoodReportEntity> _goodReportRepository;

        public GoodReportService(IDbContext ctx, 
            IRepository<GoodReportEntity> goodReportRepository)
        {
            _ctx = ctx;
            _goodReportRepository = goodReportRepository;
        }

        public void UpdateReportCache(Guid clientId, List<VnGoodReportView> list)
        {
            _ctx.GetDatabase().ExecuteSqlCommand(string.Format("delete from GoodReportCache where ClientId = '{0}'", clientId) );
            _goodReportRepository.GetDbContext().GetConfig().AutoDetectChangesEnabled = false;
            _ctx.GetConfig().AutoDetectChangesEnabled = false;
            foreach (var view in list)
            {
                _goodReportRepository.InsertWithouteSave(new GoodReportEntity(clientId, view));
                
            }

            if (list.Count > 0)
                _goodReportRepository.SaveChange();

            _goodReportRepository.GetDbContext().GetConfig().AutoDetectChangesEnabled = true;

        }

        public VnGoodReportView LoadGoodReport(Guid areaId,GoodReportFilter filter)
        {

            VnGoodReportView views = _ctx.GetDatabase().SqlQuery<VnGoodReportView>("LoadGoodReport " +
                        "@ClientId," +
                        "@AreaId," +
                        "@ShowOrderCount ," +
                        "@ShowSaleCount ," +
                        "@ShowRetSaleCount ," +
                        "@ShowSaleItemCount ," +
                        "@ShowRetSaleItemCount ," +
                        "@ShowSaleQty ," +
                        "@ShowSaleCarton ," +
                        "@ShowRetSaleQty ," +
                        "@ShowRetSaleCarton ," +
                        "@ShowSaleAmount ," +
                        "@ShowRetSaleAmount ," +
                        "@ShowSaleWeight , " +
                        "@ShowRetSaleWeight ," +
                        "@ShowSaleDiscount," +
                        "@ShowRetSaleDiscount ," +
                        "@ShowPrizeCount ," +
                        "@ShowPrizeQty ," +
                        "@ShowPrizeCarton ," +
                        "@HavingCondition ",

            new SqlParameter("@ClientId", SqlDbType.UniqueIdentifier){SqlValue = filter.ClientId},
            new SqlParameter("@AreaId", SqlDbType.UniqueIdentifier){SqlValue = areaId},
            new SqlParameter("@ShowOrderCount", SqlDbType.Bit) { SqlValue = filter.RequestCount },
            new SqlParameter("@ShowSaleCount", SqlDbType.Bit) { SqlValue = filter.FactorCount },
            new SqlParameter("@ShowRetSaleCount", SqlDbType.Bit) { SqlValue = filter.RejectCount },
            new SqlParameter("@ShowSaleItemCount", SqlDbType.Bit) { SqlValue = filter.SaleItemCount },
            new SqlParameter("@ShowRetSaleItemCount", SqlDbType.Bit) { SqlValue = filter.RejectItemCount },
            new SqlParameter("@ShowSaleQty", SqlDbType.Bit) { SqlValue = filter.SaleQty },
            new SqlParameter("@ShowSaleCarton", SqlDbType.Bit) { SqlValue = filter.SaleCarton },
            new SqlParameter("@ShowRetSaleQty", SqlDbType.Bit) { SqlValue = filter.RejectQty },
            new SqlParameter("@ShowRetSaleCarton", SqlDbType.Bit) { SqlValue = filter.RejectCarton },
            new SqlParameter("@ShowSaleAmount", SqlDbType.Bit) { SqlValue = filter.SaleAmount },
            new SqlParameter("@ShowRetSaleAmount", SqlDbType.Bit) { SqlValue = filter.RejectAmount },
            new SqlParameter("@ShowSaleWeight", SqlDbType.Bit) { SqlValue = filter.SaleWeight },
            new SqlParameter("@ShowRetSaleWeight", SqlDbType.Bit) { SqlValue = filter.RejectWeight },
            new SqlParameter("@ShowSaleDiscount", SqlDbType.Bit) { SqlValue = filter.SaleDiscount },
            new SqlParameter("@ShowRetSaleDiscount", SqlDbType.Bit) { SqlValue = filter.RejectDiscount },
            new SqlParameter("@ShowPrizeCount", SqlDbType.Bit) { SqlValue = filter.BonusCount },
            new SqlParameter("@ShowPrizeQty", SqlDbType.Bit) { SqlValue = filter.BonusQty },
            new SqlParameter("@ShowPrizeCarton", SqlDbType.Bit) { SqlValue = filter.BonusCarton },
            new SqlParameter("@HavingCondition", SqlDbType.VarChar, -1) { SqlValue = "" }


                ).FirstOrDefault();

            return views;
        }



    }
}
