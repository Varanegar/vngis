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

        public IList<TextValueView> LoadDistributArea()
        {
            IList<TextValueView> list;
            list = _ctx.GetDatabase().SqlQuery<TextValueView>("LoadDistributArea ").ToList();
            return list;
        }

      
        public IList<TextValueView> LoadRoadGroup()
        {
           
                IList<TextValueView> list = new List<TextValueView>();
                list.Add(new TextValueView(){Title = "مسیر پخش", Id = 1});
                list.Add(new TextValueView() { Title = "مسیر بازاریابی", Id = 2 });
                return list;
            
        }

        public IList<TextValueView> LoadAreaGroup()
        {

            IList<TextValueView> list = new List<TextValueView>();
            list.Add(new TextValueView() { Title = "منطقه توزیع", Id = 1 });
            list.Add(new TextValueView() { Title = "منطقه پخش", Id = 2 });
            list.Add(new TextValueView() { Title = "منطقه شهرداری", Id = 3 });
            return list;

        }
        //public IList<PointView> LoadAreaPointById(int id)
        //{
        //    using (var ctx = new MapContextFactory().Create())
        //    {
        //        IList<PointView> list;
        //        var id_param = new SqlParameter("@Id", id);

        //        list = ctx.Database.SqlQuery<PointView>("LoadLimits_Point @Id ", id_param).ToList();
        //        return list;
        //    }
        //}

    }
}
