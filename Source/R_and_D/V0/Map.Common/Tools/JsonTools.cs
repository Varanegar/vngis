using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TrackingMap.Common.Tools
{
    public class JsonTools
    {
        public static string ObjectToJson(object entity){
            return JsonConvert.SerializeObject(entity);
        }

        public static T JsonToObject<T>(string entity)
        {
            return (T)JsonConvert.DeserializeObject<T>(entity);
        }
       

    }
}
