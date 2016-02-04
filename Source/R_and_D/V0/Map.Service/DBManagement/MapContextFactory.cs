using System.IO;
using System.Linq;

namespace TrackingMap.Service.DBManagement
{
    public class MapContextFactory
    {
        private static string _ConnectionString;
        private static string GetTransferConnectionString()
        {
            return "Data Source= .;Initial Catalog=VnGisDB;Persist Security Info=True;User ID=sa;Password=sa@123";
        }

        public static MapContext Create()
        {
            
            //return new TransferContext("Data Source= 192.168.0.9;Initial Catalog=TransferDB;Persist Security Info=True;User ID=sa;Password=111");
            return new MapContext(GetTransferConnectionString());
        }
    }
}
