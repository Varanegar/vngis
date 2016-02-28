using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class RoadService
    {
        private readonly IDbContext _ctx;
        public RoadService(IDbContext ctx)
        {
            _ctx = ctx;
        }

        public IList<PointView> LoadRoadPointById(int id)
        {
            var list = new List<PointView>();
            return list;
        }

        public void SaveRoadPointList(int id, List<AreaPointView> entities)
        {
        }


        public object LoadAreaPointById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
