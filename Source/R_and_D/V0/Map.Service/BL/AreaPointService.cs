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
    public class AreaPointService
    {
        private IRepository<AreaPointEntity> _areaPointRepository;

        public AreaPointService(
            IRepository<AreaPointEntity>  areaRepository)
        {
            _areaPointRepository = areaRepository;
        }
        public IList<PointView> LoadAreaPointById(int id)
        {
            var list = _areaPointRepository.Table.Where(x => id == 0 || x.AreaEntityId == id).Select(x => new PointView()
                {
                    Id = x.Id,
                    Desc = "",
                    MasterId = x.AreaEntityId,
                    Longitude = x.Longitude,
                    Latitude = x.Latitude,
                    PointType = PointType.Limited
                }).ToList() ;
                //IList<PointView> list;
                //var id_param = new SqlParameter("@Id", id);

                //list = ctx.Database.SqlQuery<PointView>("LoadLimits_Point @Id ", id_param).ToList();
                return list;
        }

        public void SaveAreaPointList(int id, List<AreaPointView> entities)
        {
                foreach (var entityview in entities)
                {

                    AreaPointEntity entity;
                    if (entityview.Id <= 0)
                    {
                        entity = new AreaPointEntity(entityview);
                        entity.AreaEntityId = id;
                        entity.Id = 0;
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

        public bool HaseAreaPoint(int id)
        {
            return _areaPointRepository.Table.Where(x => x.AreaEntityId == id).Count() > 3;
        }


    }
}
