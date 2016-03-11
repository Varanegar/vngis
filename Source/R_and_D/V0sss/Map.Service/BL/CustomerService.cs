using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class CustomerService
    {
        private readonly IDbContext _ctx;

        public CustomerService(IDbContext ctx)
           
        {
            _ctx = ctx;
          
        }

        public List<PointView> LoadCustomerByAreaId(Guid? areaid, Guid? routid = null,
                bool showcustrout = false,
                bool showcustotherrout = false,
                bool showcustwithoutrout = false)
        {
            List<PointView> list;
            
            SqlParameter areaid_param = new SqlParameter("@AreaId",SqlDbType.UniqueIdentifier);
            areaid_param.SqlValue = areaid;

            SqlParameter routid_param = new SqlParameter("@RoutId", SqlDbType.UniqueIdentifier);
            routid_param.IsNullable = true;
            if (routid == null)
                routid_param.SqlValue = DBNull.Value;
            else
                routid_param.SqlValue = routid;
            
            SqlParameter showcustrout_param = new SqlParameter("@ShowCustRout", showcustrout);
            SqlParameter showcustotherrout_param = new SqlParameter("@ShowCustOtherRout", showcustotherrout);
            SqlParameter showcustwithoutrout_param = new SqlParameter("@ShowCustEithoutRout", showcustwithoutrout);

            list = _ctx.GetDatabase().SqlQuery<PointView>("LoadCustomerByAreaId @AreaId," +
                                                          "@RoutId," +
                                                          "@ShowCustRout," +
                                                          "@ShowCustOtherRout," +
                                                          "@ShowCustEithoutRout ", 
                                                          areaid_param,
                                                          routid_param,
                                                          showcustrout_param,
                                                          showcustotherrout_param,
                                                          showcustwithoutrout_param
                                                          ).ToList();

            return list;
        }



    }
}
