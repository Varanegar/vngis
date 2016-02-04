using System.Linq;
using System.Xml.Linq;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.BL
{
    public class ConfigService
    {
        public static void ResetConfig()
        {
            XDocument xmlDoc = XDocument.Load(DefaultValue.GetConfigFile());

            var con = (from x in xmlDoc.Descendants("config")
                        select
                        new ConfigView
                         {
                             LogLevel = (ELogLevel)System.Enum.Parse(typeof(ELogLevel), (string)x.Element("loglevel").Value ?? string.Empty),
                         }).SingleOrDefault();
            DefaultValue.SetConfig(con);
            LogService.InsertLog("ResetConfig");
        }


    }
}
