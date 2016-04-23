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

        public List<TextValueView> GetComboData(ComboFilter filter)
        {
            var list = _ctx.Database.SqlQuery<TextValueView>("select " + filter.TextName + " as Title," +
                              "cast(" + filter.ValueName + " as int) as IntId " +
                        "  from " + filter.TblName).ToList();
            if (filter.AddEmptyRow)
                list.Insert(0, new TextValueView() { IntId = -1, Title = "انتخاب کنید ..." });
            return list;

        }


        public List<TextValueView> GetAutoCompleteData(AutoCompleteFilter filter)
        {
            var list = _ctx.Database.SqlQuery<TextValueView>("select " + filter.TextName + " as Title," +
                             "cast("+filter.ValueName + " as int) as IntId " +
                        "  from " + filter.TblName+
                        " where " + filter.TextName + " like '%" + filter.SearchValue + "%'").ToList();
            if (filter.AddEmptyRow)
                list.Insert(0, new TextValueView() { IntId = -1, Title = "انتخاب کنید ..." });
            return list;
        }
    }
}
