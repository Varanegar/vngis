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

        public int GetParentIdById(int id)
        {
            var area = _areaRepository.GetById(id);
            if (area == null)
                return 0;
            return area.ParentId;
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


        public AreaView GetViewById(int id)
        {
            return _areaRepository.GetById(id).GetView();
        }

        public List<AreaView> GetAreaPathById(int id)
        {
            var list = new List<AreaView>();
            var entity = _areaRepository.GetById(id);
            while (entity.ParentId != 0)
            {
                list.Add(entity.GetView());
                entity = _areaRepository.GetById(entity.ParentId);

            }
            list.Add(entity.GetView());

            return list;
        }
    }
}
