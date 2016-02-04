using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class CustomerService
    {
        private readonly IDbContext _ctx;
        public CustomerService(IDbContext ctx) {
            _ctx = ctx;
        }

        public IList<TextValueView> LoadCustomerGroup()
        {
                IList<TextValueView> list;
                list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadAllCustomerGroups ").ToList();
                return list;
        }
        public IList<TextValueView> LoadCustomerByGroupId(int groupId, string title)
        {
                IList<TextValueView> list;

                SqlParameter groupid_param = new SqlParameter("@Group", groupId);

                SqlParameter title_param = new SqlParameter("@Title", SqlDbType.VarChar);
                title_param.SqlValue = title;

                //SqlParameter pageParam = new SqlParameter("@page", page);
                //pageParam.Direction = ParameterDirection.InputOutput;

                list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadCustomer @Group, @Title ", groupid_param, title_param).ToList();

                return list;
        }

        public IList<TextValueView> LoadActivity()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadActivity ").ToList();
            return list;
        }
    }
}
