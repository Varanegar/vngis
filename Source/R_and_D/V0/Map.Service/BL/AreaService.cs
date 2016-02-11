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
    public class AreaService
    {
        private IRepository<AreaEntity> _areaRepository;

        public AreaService(
            IRepository<AreaEntity>  areaRepository)
        {
            _areaRepository = areaRepository;
        }
        public IList<AreaView> LoadAreaByParentId(int id)
        {
            var list = _areaRepository.Table.Where(x => x.ParentId == id)
                .Select(x => new AreaView()
                {
                    Id = x.Id,
                    Title = x.Title,
                    IsLeaf = x.IsLeaf
                }).ToList() ;
            return list;
        }

    }
}
