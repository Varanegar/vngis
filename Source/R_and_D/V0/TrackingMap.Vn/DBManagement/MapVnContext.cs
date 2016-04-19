using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Vn.DBManagement
{
    public class MapVnContext : DbContext
    {
        public MapVnContext()
            : base("DBConnectionString_Map_Vn")

        {
        }
    }
}
