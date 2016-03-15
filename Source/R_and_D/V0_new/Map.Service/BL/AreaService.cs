using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Common.ViewModel;

namespace TrackingMap.Service.BL
{
    public class AreaService
    {
        private readonly IDbContext _ctx;
        private readonly IRepository<AreaEntity> _areaRepository;
        private readonly IRepository<CustomerAreaEntity> _customerAreaRepository;
        private readonly IRepository<CustomerEntity> _customerRepository;

        public AreaService( IDbContext ctx,
            IRepository<AreaEntity>  areaRepository,
            IRepository<CustomerEntity> customerRepository,
            IRepository<CustomerAreaEntity> customerAreaRepository)
        {
            _ctx = ctx;
            _areaRepository = areaRepository;
            _customerRepository = customerRepository;
            _customerAreaRepository = customerAreaRepository;
        }

        public Guid? GetParentIdById(Guid id)
        {
            var area = _areaRepository.GetById(id);
            if (area == null)
                return null;
            return area.ParentId;
        }

        public IList<TextValueView> LoadArea1() // level 1
        {
            var list = _areaRepository.Table.Where(x => x.ParentId == null)
                .Select(x => new TextValueView()
                {
                    Id = x.Id,
                    Title = x.Title,                   
                }).ToList();
            return list;
        }


        public IList<AreaView> LoadAreaByParentId(Guid? id)
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


        public AreaView GetViewById(Guid id)
        {
            return _areaRepository.GetById(id).GetView();
        }

        public List<AreaView> GetAreaPathById(Guid? id)
        {
            var list = new List<AreaView>();
            if (id != null)
            {
                var entity = _areaRepository.GetById(id);
                while (entity.ParentId != null)
                {
                    list.Add(entity.GetView());
                    entity = _areaRepository.GetById(entity.ParentId);

                }
                list.Add(entity.GetView());
            }

            return list;
        }


        public List<CustomerView> LoadCustomerSelectedByAreaId(Guid areaid, bool selected)
        {

            List<CustomerView> list;

            SqlParameter areaid_param = new SqlParameter("@areaid", areaid);
            SqlParameter selected_param = new SqlParameter("@selected", selected);

            list = _ctx.GetDatabase().SqlQuery<CustomerView>("LoadSelectedCustomerByPathId @AreaId, @Selected ", areaid_param, selected_param).ToList();

            return list;

            //List<CustomerView> list;
            //if (selected)
            //{
            //    var q = from cust in _customerRepository.Table
            //        join
            //            are in _customerAreaRepository.Table on cust.Id equals are.CustomerEntityId
            //        where (are.AreaEntityId == areaid)
            //        select new CustomerView() {Id = cust.Id, Title = cust.Title};

            //    list = q.ToList();
            //}
            //else
            //{

            //    var customer_in_area_list = _customerAreaRepository.Table.Where(x => x.AreaEntityId == areaid).ToList();

            //    var q = from cust in _customerRepository.Table
            //            where ( !(customer_in_area_list.Any(x => x.CustomerEntityId == cust.Id)) )
            //            select new CustomerView() { Id = cust.Id, Title = cust.Title };

            //    list = q.ToList();
                
            //}
            //return list;
        }

        public bool AddCustomerToSelected(Guid customerId, Guid areaId)
        {
            var custar = new CustomerAreaEntity();
            custar.AreaEntityId = areaId;
            custar.CustomerEntityId = customerId;
            
            var find = _customerAreaRepository.Table
                .FirstOrDefault(x => x.AreaEntityId == areaId && x.CustomerEntityId == customerId);
            if (find == null)
                _customerAreaRepository.Insert(custar);
            return true;
        }

        public bool RemoveCustomerFromSelected(Guid customerId, Guid areaId)
        {
            var custar = _customerAreaRepository.Table.FirstOrDefault(x => x.CustomerEntityId == customerId && x.AreaEntityId == areaId);
            _customerAreaRepository.Delete(custar);
            return true;
        }
    }
}
