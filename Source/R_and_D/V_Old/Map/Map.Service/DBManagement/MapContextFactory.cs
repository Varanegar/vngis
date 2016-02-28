using System.IO;
using System.Linq;

namespace TrackingMap.Service.DBManagement
{
    public class MapContextFactory
    {
        private static string _ConnectionString;
        private static string GetTransferConnectionString()
        {
            if (string.IsNullOrEmpty(_ConnectionString))
            {
                string constr = "";

                //use webHelper.MapPath instead of HostingEnvironment.MapPath which is not available in unit tests
                string filePath = DefaultValue.GetAppDataPath()+"Config.ini";
                

                if (File.Exists(filePath))
                {
                    var lines = File.ReadLines(filePath);
                    constr = CipherTools.StringCipherTools.Decrypt(lines.ElementAt(0));
                }

                _ConnectionString = constr;

            }
            return _ConnectionString;
        }

        public static MapContext Create()
        {
            
            //return new TransferContext("Data Source= 192.168.0.9;Initial Catalog=TransferDB;Persist Security Info=True;User ID=sa;Password=111");
            return new MapContext(GetTransferConnectionString());
        }
    }
}
