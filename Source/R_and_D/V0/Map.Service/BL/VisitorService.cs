using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Service.Tools;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class VisitorService
    {
        private readonly IDbContext _ctx;
        private readonly IRepository<VisitorGroupEntity> _visitorGroupRepository;
        private readonly IRepository<VisitorEntity> _visitorRepository;
        private readonly IRepository<VisitorPathEntity> _visitorPathRepository;
        private readonly IRepository<VisitorDailyPathEntity> _visitorDailyPathRepository;
        private readonly IRepository<AreaPointEntity> _areaPointRepository;

        public VisitorService(IDbContext ctx,
            IRepository<VisitorGroupEntity> visitorGroupRepository,
            IRepository<VisitorPathEntity> visitorPathRepository,
            IRepository<VisitorDailyPathEntity> visitorDailyPathRepository,
            IRepository<VisitorEntity> visitorRepository,
            IRepository<AreaPointEntity> areaPointRepository
            )
        {
            _ctx = ctx;
            _visitorGroupRepository = visitorGroupRepository;
            _visitorRepository = visitorRepository;
            _visitorPathRepository = visitorPathRepository;
            _visitorDailyPathRepository = visitorDailyPathRepository;
            _areaPointRepository = areaPointRepository;
        }

        public IList<TextValueView> LoadVisitorGroup()
        {
            IList<TextValueView> list;
            list = _visitorGroupRepository.Table.Select(x => new TextValueView(){Id = x.Id, Title = x.Title}).ToList();
            return list;
        }
        public List<TextValueView> LoadVisitorByGroupId(int groupId)
        {
            List<TextValueView> list;
            list =
                _visitorRepository.Table.Where(x => x.VisitorGroupEntityId == groupId)
                    .Select(x => new TextValueView() {Id = x.Id, Title = x.Title})
                    .ToList();
                return list;
        }

        public List<PointView> LoadVisitorPath(string date, List<int> visitorIds )
        {
            //List<PointView> list;
            //var vis = GeneralTools.IntListTostring(visitorIds);
            //SqlParameter date_param = new SqlParameter("@Date", date);
            //SqlParameter ids_param = new SqlParameter("@VisitorIds", vis);
            //list = _ctx.GetDatabase().SqlQuery<PointView>("LoadVisitorsPath @Date, @VisitorIds ", date_param, ids_param).ToList();
            //return list;

            var list = _visitorPathRepository.Table.Where(x => visitorIds.Contains(x.VisitorEntityId))
                .Select(
                    x =>
                        new PointView()
                        {
                            Id = x.Id,
                            MasterId = x.VisitorEntityId,
                            Latitude = x.Latitude,
                            Longitude = x.Longitude
                        }).ToList();
            return list;
        }

        public List<PointView> LoadDailyPath(string date, List<int> visitorIds)
        {
            //List<PointView> list;
            //var vis = GeneralTools.IntListTostring(visitorIds);
            //SqlParameter date_param = new SqlParameter("@Date", date);
            //SqlParameter ids_param = new SqlParameter("@VisitorIds", vis);
            //list = _ctx.GetDatabase().SqlQuery<PointView>("LoadVisitorsPath @Date, @VisitorIds ", date_param, ids_param).ToList();
            //return list;

            var q = from path in _areaPointRepository.Table
                join vispath in _visitorDailyPathRepository.Table on path.AreaEntityId equals vispath.AreaEntityId
                where (visitorIds.Contains(vispath.VisitorEntityId))
                select
                    new PointView()
                    {
                        Id = path.Id,
                        Latitude = path.Latitude,
                        Longitude = path.Longitude,
                        MasterId = vispath.VisitorEntityId
                    };
            var list = q.ToList();
            return list;
        }

    }
}
