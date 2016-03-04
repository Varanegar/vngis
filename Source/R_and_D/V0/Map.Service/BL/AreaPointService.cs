using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class AreaPointService
    {
        private IRepository<AreaPointEntity> _areaPointRepository;
        private IRepository<AreaEntity> _areaRepository;

        public AreaPointService(
            IRepository<AreaPointEntity>  areaPointRepository,
            IRepository<AreaEntity>  areaRepository
            )
        {
            _areaRepository = areaRepository;
            _areaPointRepository = areaPointRepository;
        }

        public IList<PointView> LoadAreaPointById(Guid? id)
        {
            var list = _areaPointRepository.Table.Where(x => id == null || x.AreaEntityId == id).Select(x => new PointView()
                {
                    Id = x.Id,
                    Desc = "",
                    MasterId = x.AreaEntityId,
                    Longitude = x.Longitude,
                    Latitude = x.Latitude,
                    PointType = PointType.Point
                }).ToList() ;
                //IList<PointView> list;
                //var id_param = new SqlParameter("@Id", id);

                //list = ctx.Database.SqlQuery<PointView>("LoadLimits_Point @Id ", id_param).ToList();
                return list;
        }

        public IList<PointView> LoadAreaPointByParentId(Guid? id)
        {

            var q = from area in _areaRepository.Table
                    join point in _areaPointRepository.Table on area.Id equals point.AreaEntityId
                    where (area.ParentId == id)
                    select new PointView()
                            {
                                Id = point.Id,
                                Desc = "",
                                MasterId = point.AreaEntityId,
                                Longitude = point.Longitude,
                                Latitude = point.Latitude,
                                IsLeaf = area.IsLeaf,
                                PointType = PointType.Point
                            };
            //IList<PointView> list;
            //var id_param = new SqlParameter("@Id", id);

            //list = ctx.Database.SqlQuery<PointView>("LoadLimits_Point @Id ", id_param).ToList();
            return q.ToList();
        }

        public void SaveAreaPointList(Guid id, List<AreaPointView> entities)
        {
                foreach (var entityview in entities)
                {

                    AreaPointEntity entity;
                    if ((entityview.Id == null) || (entityview.Id.ToString().StartsWith("00000000-0000")))
                    {
                        entity = new AreaPointEntity(entityview);
                        entity.AreaEntityId = id;
                        entity.IntId = 0;
                        _areaPointRepository.Insert(entity);
                    }
                    else
                    {
                        entity = _areaPointRepository.GetById(entityview.Id);
                        if (entity != null)
                        {
                            entity.Longitude = entityview.Lng;
                            entity.Latitude = entityview.Lat;
                        }
                        _areaPointRepository.Update(entity);
                    }
                }
        }

        public bool HaseAreaPoint(Guid id)
        {
            return _areaPointRepository.Table.Where(x => x.AreaEntityId == id).Count() > 3;
        }


    }
}
