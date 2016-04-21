using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Common.Tools;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.Vn.DBManagement;
using TrackingMap.Common.Tools;

namespace TrackingMap.Service.Vn.BL
{
    public class VnGoodReportService
    {
        private readonly MapVnContext _ctx;

        public VnGoodReportService(MapVnContext ctx)
        {
            _ctx = ctx;
        }

        public List<GoodReportView> LoadGoodReport(GoodReportFilter filter)
        {

            List<GoodReportView> views = _ctx.Database.SqlQuery<GoodReportView>("Usp_GIS_Load_getList " +
                                                                                    "@ReportType , " +
                                                                                    "@DcList, " +
                                                                                    "@Startdate , " +
                                                                                    "@EndDate ," +
                                                                                    "@SaleOfficeList ," +
                                                                                    "@SupervisorList , " +
                                                                                    "@DealerList, " +
                                                                                    "@CustCtgrList , " +
                                                                                    "@CustActList , " +
                                                                                    "@CustLevelList, " +
                                                                                    "@CountNotVisit, " +
                                                                                    "@GoodsGroupList, " +
                                                                                    "@SubTypeList , " +
                                                                                    "@BrandList," +
                                                                                    "@GoodsList ," +
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

            new SqlParameter("@ReportType", SqlDbType.Int){SqlValue = 1},

                new SqlParameter("@DcList", SqlDbType.VarChar, -1) {SqlValue = "-1"},

                new SqlParameter("@Startdate", SqlDbType.VarChar, 8) {SqlValue = filter.FromDate.Substring(2)},
                new SqlParameter("@EndDate", SqlDbType.VarChar, 8) { SqlValue = filter.ToDate.Substring(2) },
            new SqlParameter("@SaleOfficeList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.SaleOffice, "-1").ToString()},
            new SqlParameter("@SupervisorList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.Header, "-1").ToString()},
            new SqlParameter("@DealerList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.Seller, "-1").ToString()},
            new SqlParameter("@CustCtgrList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.CustomerClass, "-1").ToString()},
            new SqlParameter("@CustActList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.CustomerActivity, "-1").ToString()},
            new SqlParameter("@CustLevelList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.CustomerDegree, "-1").ToString()},
            new SqlParameter("@CountNotVisit", SqlDbType.Int){SqlValue = DbUtility.IsNull(filter.DayCount, "-1").ToString()},
            new SqlParameter("@GoodsGroupList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.GoodGroup, "-1").ToString()},
            new SqlParameter("@SubTypeList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.DynamicGroup, "-1").ToString()},
            new SqlParameter("@BrandList", SqlDbType.VarChar, -1){SqlValue = "-1"},
            new SqlParameter("@GoodsList", SqlDbType.VarChar, -1){SqlValue = DbUtility.IsNull(filter.Good, "-1").ToString()},

            new SqlParameter("@ShowOrderCount", SqlDbType.Bit){SqlValue = true/*filter.RequestCount*/},
            new SqlParameter("@ShowSaleCount", SqlDbType.Bit){SqlValue = true/*filter.FactorCount*/},
            new SqlParameter("@ShowRetSaleCount", SqlDbType.Bit){SqlValue = true/*filter.RejectCount*/},
            new SqlParameter("@ShowSaleItemCount", SqlDbType.Bit){SqlValue = true/*filter.SaleItemCount*/},
            new SqlParameter("@ShowRetSaleItemCount", SqlDbType.Bit){SqlValue = true/*filter.RejectItemCount*/},
            new SqlParameter("@ShowSaleQty", SqlDbType.Bit){SqlValue = true/*filter.SaleQty*/},
            new SqlParameter("@ShowSaleCarton", SqlDbType.Bit){SqlValue = true/*filter.SaleCarton*/},
            new SqlParameter("@ShowRetSaleQty", SqlDbType.Bit){SqlValue = true/*filter.RejectQty*/},
            new SqlParameter("@ShowRetSaleCarton", SqlDbType.Bit){SqlValue = true/*filter.RejectCarton*/},
            new SqlParameter("@ShowSaleAmount", SqlDbType.Bit){SqlValue = true/*filter.SaleAmount*/},
            new SqlParameter("@ShowRetSaleAmount", SqlDbType.Bit){SqlValue = true/*filter.RejectAmount*/},
            new SqlParameter("@ShowSaleWeight", SqlDbType.Bit){SqlValue = true/*filter.SaleWeight*/},
            new SqlParameter("@ShowRetSaleWeight", SqlDbType.Bit){SqlValue = true/*filter.RejectWeight*/},
            new SqlParameter("@ShowSaleDiscount", SqlDbType.Bit){SqlValue = true/*filter.SaleDiscount*/},
            new SqlParameter("@ShowRetSaleDiscount", SqlDbType.Bit){SqlValue = true/*filter.RejectDiscount*/},
            new SqlParameter("@ShowPrizeCount", SqlDbType.Bit){SqlValue = true/*filter.BonusCount*/},
            new SqlParameter("@ShowPrizeQty", SqlDbType.Bit){SqlValue = true/*filter.BonusQty*/},
            new SqlParameter("@ShowPrizeCarton", SqlDbType.Bit){SqlValue =true/* filter.BonusCarton*/},
            new SqlParameter("@HavingCondition", SqlDbType.VarChar, -1){SqlValue = ""}

                ).ToList();

            return views;
        }


    }

}
