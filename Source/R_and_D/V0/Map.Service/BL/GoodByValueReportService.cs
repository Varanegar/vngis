using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Common.ViewModel;
using TrackingMap.Service.DBManagement;

namespace TrackingMap.Service.BL
{
    public class GoodByValueReportService
    {
        private readonly MapContext _ctx;

        public GoodByValueReportService(MapContext ctx)           
        {
            _ctx = ctx;          
        }

        public List<GoodByValueReportView> LoadGoodByValueReport(GoodByValueReportFilter filter)
        {
            List<GoodByValueReportView> view;

            view = _ctx.GetDatabase().SqlQuery<GoodByValueReportView>("LoadGoodByValueReport "
            ).ToList();

            return view;
        }


    }
}
