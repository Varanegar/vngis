using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Filter;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class TrackerService
    {
        private readonly IDbContext _ctx;
        public TrackerService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<PointView> LoadMapTracker(ReportFilter filter)
        {

                SqlParameter chkvisitor_param = new SqlParameter("@chvisitor", filter.Visitor);
                SqlParameter chkmachin_param = new SqlParameter("@chMachin", filter.Machin);
                SqlParameter fromdate_param = new SqlParameter("@FromDate", SqlDbType.VarChar);
                fromdate_param.SqlValue = filter.FromDate ?? "";
                SqlParameter todate_param = new SqlParameter("@ToDate", SqlDbType.VarChar);
                todate_param.SqlValue = filter.ToDate ?? "";
                SqlParameter fromtime_param = new SqlParameter("@FromTime", SqlDbType.VarChar);
                fromtime_param.SqlValue = filter.FromDate ?? "";
                SqlParameter totime_param = new SqlParameter("@ToTime", SqlDbType.VarChar);
                totime_param.SqlValue = filter.FromDate ?? "";
                SqlParameter visitorid_param = new SqlParameter("@VisitorId", filter.VisitorId);
                //SqlParameter machinid_param = new SqlParameter("@MachinId", filter.MachinId);

                var list = _ctx.GetDatabase().SqlQuery<PointView>("TrackerReport_Map " +
                                                                    "@chvisitor, " +
	                                                                "@chMachin, " +
	                                                                "@FromDate," +
	                                                                "@ToDate," +
	                                                                "@FromTime," +
	                                                                "@ToTime," +
	                                                                "@VisitorId" ,
                                                                    chkvisitor_param,
                                                                    chkmachin_param,
                                                                    fromdate_param,
                                                                    todate_param,
                                                                    fromtime_param,
                                                                    totime_param,
                                                                    visitorid_param
                                                            ).ToList();

                return list;
            }
    
    }
}
