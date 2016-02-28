using System.Collections.Generic;

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

        public List<PointView> LoadCustomerByAreaId(int areaid)
        {
            List<PointView> list;

            SqlParameter areaid_param = new SqlParameter("@AreaId", areaid);

            list = _ctx.GetDatabase().SqlQuery<PointView>("LoadCustomerByAreaId @AreaId ", areaid_param).ToList();

            return list;
        }



    }
}
