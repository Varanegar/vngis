using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.Vn.DBManagement;

namespace TrackingMap.Service.Vn.BL
{
    public class VnService
    {
        private readonly MapVnContext _ctx;
        public VnService(MapVnContext ctx)
        {
            _ctx = ctx;
        }

        public List<TextValueView> GetComboData(string tblName, string valueName, string txtName)
        {
            var list = _ctx.Database.SqlQuery<TextValueView>("select " + valueName + "as Title," + 
                             txtName + " as Id " +
                        "  from " + tblName).ToList();
            return list;

        }

    }
}
