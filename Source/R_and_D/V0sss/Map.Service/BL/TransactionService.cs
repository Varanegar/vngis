using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Entity;
using TrackingMap.Service.Enum;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class TransactionService
    {
        private readonly IRepository<CustomerEntity> _customerRepository;
        private readonly IRepository<TransactionEntity> _transactionRepository;

        public TransactionService(IRepository<CustomerEntity>  customerRepository,
            IRepository<TransactionEntity> transactionRepository)
        {
            _customerRepository = customerRepository;
            _transactionRepository = transactionRepository;
        }

        public List<PointView> LoadTransactionList(List<Guid> visitorIds)
        {
            var list = _transactionRepository.Table.Where(x => visitorIds.Contains(x.VisitorEntityId))
               .Select(
                   x =>
                       new PointView()
                       {
                           Id = x.Id,
                           MasterId = x.VisitorEntityId,
                           Latitude = x.Latitude,
                           Longitude = x.Longitude,
                           PointType = (int)ETransactionType.ORDER
                       }).ToList();
            return list;
        }

    }
}
