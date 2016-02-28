using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class DistributService
    {
        private readonly IDbContext _ctx;
        public DistributService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<TextValueView> LoadDistributer()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadDistributer ").ToList();
            return list;
        }

        public IList<TextValueView> LoadDriver()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadDriver ").ToList();
            return list;
        }

        public IList<TextValueView> LoadRood()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadRoad ").ToList();
            return list;
        }

        public IList<TextValueView> LoadArea1()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadArea1 ").ToList();
            return list;
        }

        public IList<TextValueView> LoadArea2(int parentid)
        {
            IList<TextValueView> list;
            SqlParameter parentid_param = new SqlParameter("@ParentId", parentid);
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadArea2 " , parentid_param).ToList();
            return list;
        }
        public IList<TextValueView> LoadArea3(int parentid)
        {
            IList<TextValueView> list;
            SqlParameter parentid_param = new SqlParameter("@ParentId", parentid);
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadArea3 ", parentid_param).ToList();
            return list;
        }
      

    }
}
