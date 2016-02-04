using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class GoodService
    {
        private readonly IDbContext _ctx;
        public GoodService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<TextValueView> LoadGoodGroup()
        {
                IList<TextValueView> list;
                list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadAllGoodGroups ").ToList();
                return list;
        }

        public IList<TextValueView> LoadGoodByGroupId(int groupId)
        {
                IList<TextValueView> list;

                SqlParameter groupid_param = new SqlParameter("@Group", groupId);

                //SqlParameter pageParam = new SqlParameter("@page", page);
                //pageParam.Direction = ParameterDirection.InputOutput;

                list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadGood @Group ", groupid_param).ToList();

                return list;
        }

    
    }
}
