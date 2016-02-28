using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class VisitorService
    {
        private readonly IDbContext _ctx;
        public VisitorService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<TextValueView> LoadVisitorGroup()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadAllVisitorGroups ").ToList();
            return list;
        }
        public IList<TextValueView> LoadVisitorByGroupId(int groupId)
        {
                IList<TextValueView> list;

                SqlParameter groupid_param = new SqlParameter("@Group", groupId);


                //SqlParameter pageParam = new SqlParameter("@page", page);
                //pageParam.Direction = ParameterDirection.InputOutput;

                list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadVisitor @Group ", groupid_param).ToList();

                return list;
        }

    
    }
}
