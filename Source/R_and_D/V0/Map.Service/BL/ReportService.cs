using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Filter;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class ReportService
    {
        private readonly IDbContext _ctx;
        public ReportService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<PointView> LoadMapPoint(ReportFilter filter)
        {
                SqlParameter chkorder_param = new SqlParameter("@chOrder", filter.Order);
                SqlParameter chkfactor_param = new SqlParameter("@chFactor", filter.Factor);
                SqlParameter chknotorder_param = new SqlParameter("@chNotOrdered", filter.NotOrdered);
                SqlParameter chknotvisit_param = new SqlParameter("@chNotVisit", filter.NotVisit);
                SqlParameter chkcustomer_param = new SqlParameter("@chCustomer", filter.Customer);
                SqlParameter chkmachin_param = new SqlParameter("@chMachin", filter.Machin);
                SqlParameter chkvisitor_param = new SqlParameter("@chVisitor", filter.Visitor);
                
                SqlParameter fromdate_param = new SqlParameter("@FromDate", SqlDbType.VarChar);
                fromdate_param.SqlValue = filter.FromDate ?? "";
                SqlParameter todate_param = new SqlParameter("@ToDate", SqlDbType.VarChar);
                todate_param.SqlValue = filter.ToDate ?? "";
                SqlParameter fromtime_param = new SqlParameter("@FromTime", SqlDbType.VarChar);
                fromtime_param.SqlValue = filter.FromTime ?? "";
                SqlParameter totime_param = new SqlParameter("@ToTime", SqlDbType.VarChar);
                totime_param.SqlValue = filter.ToTime ?? "";

                SqlParameter visitorgroup_param = new SqlParameter("@VisitorGroupId", filter.VisitorGroupId);
                SqlParameter visitor_param = new SqlParameter("@VisitorId", filter.VisitorId);
                SqlParameter customergroup_param = new SqlParameter("@CustomerGroupId", filter.CustomerGroupId);
                SqlParameter customer_param = new SqlParameter("@CustomerId", filter.CustomerId);
                SqlParameter goodgroup_param = new SqlParameter("@GoodGroupId", filter.GoodGroupId);
                SqlParameter good_param = new SqlParameter("@GoodId", filter.GoodId);

                SqlParameter driver_param = new SqlParameter("@DriverId", filter.DriverId);
                SqlParameter distributer_param = new SqlParameter("@DistributerId", filter.DistributerId);

                SqlParameter fromroad_param = new SqlParameter("@FromRoadId", filter.FromRoadId);
                SqlParameter toroad_param = new SqlParameter("@ToRoadId", filter.ToRoadId);

                SqlParameter distributarea_param = new SqlParameter("@DistributArea", SqlDbType.VarChar);
                distributarea_param.SqlValue = filter.DistributArea ?? "";
                SqlParameter area_param = new SqlParameter("@Area", SqlDbType.VarChar);
                area_param.SqlValue = filter.Area ?? "";
                
                var list = _ctx.GetDatabase().SqlQuery<PointView>("TransactionReport_Map " +
                                                                    "@chOrder, " +
	                                                                "@chFactor, " +
	                                                                "@chNotOrdered," +
                                                                    "@chNotVisit," +
                                                                    "@chCustomer, " +
	                                                                "@chMachin, " +
                                                                    "@chVisitor, " +
                                                                    "@FromDate," +
	                                                                "@ToDate," +
	                                                                "@FromTime," +
	                                                                "@ToTime," +
	                                                                "@VisitorGroupId," +
	                                                                "@VisitorId," +
	                                                                "@CustomerGroupId," +
	                                                                "@CustomerId," +
	                                                                "@GoodGroupId," +
	                                                                "@GoodId ," +
	                                                                "@DriverId," +
	                                                                "@DistributerId ," +
	                                                                "@FromRoadId," +
	                                                                "@ToRoadId ," +
	                                                                "@DistributArea," +
	                                                                "@Area ", 
                                                                    chkorder_param,
                                                                    chkfactor_param,
                                                                    chknotorder_param ,
                                                                    chknotvisit_param,
                                                                    chkcustomer_param,
                                                                    chkmachin_param,
                                                                    chkvisitor_param,
                                                                    fromdate_param,
                                                                    todate_param,
                                                                    fromtime_param,
                                                                    totime_param,
                                                                    visitorgroup_param,
                                                                    visitor_param ,
                                                                    customergroup_param,
                                                                    customer_param,
                                                                    goodgroup_param,
                                                                    good_param,
                                                                    driver_param,
                                                                    distributer_param,
                                                                    fromroad_param,
                                                                    toroad_param,
                                                                    distributarea_param,
                                                                    area_param
                                                            ).ToList();

                return list;
        }

        //public PagingList<OrderListView> LoadListReport(ReportFilter filter)
        //{
        //    using (var ctx = new MapContextFactory().Create())
        //    {
        //        SqlParameter chkorder_param = new SqlParameter("@chOrder", filter.Order);
        //        SqlParameter chkfactor_param = new SqlParameter("@chFactor", filter.Factor);
        //        SqlParameter chknotorder_param = new SqlParameter("@chNotOrdered", filter.NotOrdered);
        //        SqlParameter chkcustomer_param = new SqlParameter("@chCustomer", filter.Customer);
        //        SqlParameter chkmachin_param = new SqlParameter("@chMachin", filter.Machin);

        //        SqlParameter fromdate_param = new SqlParameter("@FromDate", SqlDbType.VarChar);
        //        fromdate_param.SqlValue = filter.FromDate ?? "";
        //        SqlParameter todate_param = new SqlParameter("@ToDate", SqlDbType.VarChar);
        //        todate_param.SqlValue = filter.ToDate ?? "";
        //        SqlParameter fromtime_param = new SqlParameter("@FromTime", SqlDbType.VarChar);
        //        fromtime_param.SqlValue = filter.FromDate ?? "";
        //        SqlParameter totime_param = new SqlParameter("@ToTime", SqlDbType.VarChar);
        //        totime_param.SqlValue = filter.FromDate ?? "";

        //        SqlParameter visitorgroup_param = new SqlParameter("@VisitorGroupId", filter.VisitorGroupId);
        //        SqlParameter visitor_param = new SqlParameter("@VisitorId", filter.VisitorId);
        //        SqlParameter customergroup_param = new SqlParameter("@CustomerGroupId", filter.CustomerGroupId);
        //        SqlParameter customer_param = new SqlParameter("@CustomerId", filter.CustomerId);
        //        SqlParameter goodgroup_param = new SqlParameter("@GoodGroupId", filter.GoodGroupId);
        //        SqlParameter good_param = new SqlParameter("@GoodId", filter.GoodId);

        //        SqlParameter driver_param = new SqlParameter("@DriverId", filter.DriverId);
        //        SqlParameter distributer_param = new SqlParameter("@DistributerId", filter.DistributerId);

        //        SqlParameter fromroad_param = new SqlParameter("@FromRoadId", filter.FromRoadId);
        //        SqlParameter toroad_param = new SqlParameter("@ToRoadId", filter.ToRoadId);

        //        SqlParameter distributarea_param = new SqlParameter("@DistributArea", SqlDbType.VarChar);
        //        distributarea_param.SqlValue = filter.DistributArea ?? "";
        //        SqlParameter area_param = new SqlParameter("@Area", SqlDbType.VarChar);
        //        area_param.SqlValue = filter.Area ?? "";

        //        var list = ctx.Database.SqlQuery<OrderListView>("TransactionReport_List " +
        //                                                            "@chOrder, " +
        //                                                            "@chFactor, " +
        //                                                            "@chNotOrdered," +
        //                                                            "@chCustomer, " +
        //                                                            "@chMachin, " +
        //                                                            "@FromDate," +
        //                                                            "@ToDate," +
        //                                                            "@FromTime," +
        //                                                            "@ToTime," +
        //                                                            "@VisitorGroupId," +
        //                                                            "@VisitorId," +
        //                                                            "@CustomerGroupId," +
        //                                                            "@CustomerId," +
        //                                                            "@GoodGroupId," +
        //                                                            "@GoodId ," +
        //                                                            "@DriverId," +
        //                                                            "@DistributerId ," +
        //                                                            "@FromRoadId," +
        //                                                            "@ToRoadId ," +
        //                                                            "@DistributArea," +
        //                                                            "@Area ",
        //                                                            chkorder_param,
        //                                                            chkfactor_param,
        //                                                            chknotorder_param,
        //                                                            chkcustomer_param,
        //                                                            chkmachin_param,
        //                                                            fromdate_param,
        //                                                            todate_param,
        //                                                            fromtime_param,
        //                                                            totime_param,
        //                                                            visitorgroup_param,
        //                                                            visitor_param,
        //                                                            customergroup_param,
        //                                                            customer_param,
        //                                                            goodgroup_param,
        //                                                            good_param,
        //                                                            driver_param,
        //                                                            distributer_param,
        //                                                            fromroad_param,
        //                                                            toroad_param,
        //                                                            distributarea_param,
        //                                                            area_param
        //                                                    ).ToList();

        //        return new PagingList<OrderListView>(list, 1, 20);
        //    }
        //}

    
    }
}
