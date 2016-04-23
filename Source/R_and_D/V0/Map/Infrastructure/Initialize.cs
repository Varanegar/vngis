using System.IO;
using TrackingMap.Service;
using TrackingMap.Service.BL;

namespace TrackingMap.Infrastructure
{
    public class Initialize
    {
        public static void Execute()
        {
            DefaultValue.SetServerPath(System.Web.HttpContext.Current.Server.MapPath("").Replace("\\", "/"));
            MakeDirectory();
            ConfigService.ResetConfig();
        }

        private static void MakeDirectory()
        {
            var folder = DefaultValue.GetUserDataPath();
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
            folder = DefaultValue.GetImagePath();
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
            folder = DefaultValue.GetLogPath();
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        }
    }
}